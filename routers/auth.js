const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const pool = require("../config/db");

const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const {
  generateAccessToken,
  generateRefreshToken,
  hashToken
} = require("../utils/tokens");


// ==========================
// REGISTER
// ==========================
router.post("/register", asyncHandler(async (req, res) => {

  const { email, password } = req.body;

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

  res.status(201).json(result.rows[0]);

}));


// ==========================
// LOGIN
// ==========================
router.post("/login", asyncHandler(async (req, res) => {

  const { email, password } = req.body;

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

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ token: accessToken });

}));


// ==========================
// REFRESH TOKEN
// ==========================
router.post("/refresh", asyncHandler(async (req, res) => {

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token requerido", 401);
  }

  const payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const tokenHash = hashToken(refreshToken);

  const tokenResult = await pool.query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = $1 AND revoked = false`,
    [tokenHash]
  );

  if (tokenResult.rowCount === 0) {
    throw new AppError("Refresh token inválido", 401);
  }

  // Rotación
  await pool.query(
    `UPDATE refresh_tokens
    SET revoked = true
    WHERE token_hash = $1`,
    [tokenHash]
  );

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

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ token: newAccessToken });

}));


// ==========================
// LOGOUT
// ==========================
router.post("/logout", asyncHandler(async (req, res) => {

  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);

    await pool.query(
      `UPDATE refresh_tokens
      SET revoked = true
      WHERE token_hash = $1`,
      [tokenHash]
    );

    logger.info({
      event: "LOGOUT_SUCCESS"
    });
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Sesión cerrada" });

}));


module.exports = router;
