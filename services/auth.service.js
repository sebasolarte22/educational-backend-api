const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const {
  generateAccessToken,
  generateRefreshToken,
  hashToken
} = require("../utils/tokens");

const blacklist = require("../infrastructure/redis/blacklistRepository");

// ==========================
// REGISTER
// ==========================
async function register({ email, password }) {
  if (!email || !password) {
    throw new AppError("Email y password son obligatorios", 400);
  }

  const existe = await pool.query(
    "SELECT id FROM usuarios WHERE email = $1",
    [email]
  );

  if (existe.rowCount > 0) {
    throw new AppError("El usuario ya existe", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO usuarios (email, password)
    VALUES ($1, $2)
    RETURNING id, email, role`,
    [email, hashedPassword]
  );

  logger.info({
    event: "USER_REGISTERED",
    userId: result.rows[0].id
  });

  return result.rows[0];
}

// ==========================
// LOGIN
// ==========================
async function login({ email, password }) {
  if (!email || !password) {
    throw new AppError("Email y password son obligatorios", 400);
  }

  const result = await pool.query(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  );

  if (result.rowCount === 0) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const usuario = result.rows[0];

  const passwordValido = await bcrypt.compare(
    password,
    usuario.password
  );

  if (!passwordValido) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const accessToken = generateAccessToken(usuario);
  const refreshToken = generateRefreshToken(usuario);
  const refreshHash = hashToken(refreshToken);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [usuario.id, refreshHash]
  );

  logger.info({
    event: "LOGIN_SUCCESS",
    userId: usuario.id
  });

  return { accessToken, refreshToken };
}

// ==========================
// REFRESH
// ==========================
async function refresh({ refreshToken }) {
  if (!refreshToken) {
    throw new AppError("Refresh token requerido", 401);
  }

  const payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const tokenHash = hashToken(refreshToken);

  // ⭐ CHECK BLACKLIST (nuevo)
  const blacklisted = await blacklist.has(tokenHash);
  if (blacklisted) {
    throw new AppError("Refresh token inválido", 401);
  }

  const tokenResult = await pool.query(
    `SELECT * FROM refresh_tokens
    WHERE token_hash = $1 AND revoked = false`,
    [tokenHash]
  );

  if (tokenResult.rowCount === 0) {
    throw new AppError("Refresh token inválido", 401);
  }

  // ⭐ rotation DB revoke
  await pool.query(
    `UPDATE refresh_tokens
    SET revoked = true
    WHERE token_hash = $1`,
    [tokenHash]
  );

  // ⭐ add blacklist (nuevo)
  await blacklist.add(tokenHash);

  const userResult = await pool.query(
    `SELECT id, email, role FROM usuarios WHERE id = $1`,
    [payload.id]
  );

  const user = userResult.rows[0];

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  const newRefreshHash = hashToken(newRefreshToken);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [user.id, newRefreshHash]
  );

  logger.info({
    event: "REFRESH_SUCCESS",
    userId: user.id
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

// ==========================
// LOGOUT
// ==========================
async function logout({ refreshToken }) {
  if (!refreshToken) return;

  const tokenHash = hashToken(refreshToken);

  await pool.query(
    `UPDATE refresh_tokens
    SET revoked = true
    WHERE token_hash = $1`,
    [tokenHash]
  );

  // ⭐ add blacklist (nuevo)
  await blacklist.add(tokenHash);

  logger.info({
    event: "LOGOUT_SUCCESS"
  });
}

module.exports = {
  register,
  login,
  refresh,
  logout
};