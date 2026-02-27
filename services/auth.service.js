const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const AppError = require("../utils/AppError");

const SALT = 10;

//
// ==========================
// REGISTER
// ==========================
//
async function register({ email, password }) {
  if (!email || !password) {
    throw new AppError("Email and password required", 400);
  }

  const exists = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (exists.rowCount > 0) {
    throw new AppError("User already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
    VALUES ($1,$2)
    RETURNING id, email, role`,
    [email, passwordHash]
  );

  return result.rows[0];
}

//
// ==========================
// LOGIN
// ==========================
//
async function login({ email, password }) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    throw new AppError("Invalid credentials", 401);
  }

  // ACCESS TOKEN
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  // REFRESH TOKEN
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  const tokenHash = await bcrypt.hash(refreshToken, SALT);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1,$2, NOW() + interval '7 days')`,
    [user.id, tokenHash]
  );

  return {
    accessToken,
    refreshToken
  };
}

//
// ==========================
// REFRESH (ROTATION)
// ==========================
//
async function refresh(oldToken) {
  if (!oldToken) {
    throw new AppError("Refresh token required", 401);
  }

  const payload = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);

  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE user_id = $1 AND revoked = false",
    [payload.id]
  );

  const tokens = result.rows;

  let validRecord = null;

  for (const record of tokens) {
    const ok = await bcrypt.compare(oldToken, record.token_hash);
    if (ok) {
      validRecord = record;
      break;
    }
  }

  if (!validRecord) {
    throw new AppError("Invalid refresh token", 401);
  }

  // revoke old
  await pool.query(
    "UPDATE refresh_tokens SET revoked = true WHERE id = $1",
    [validRecord.id]
  );

  // new tokens
  const newAccessToken = jwt.sign(
    { id: payload.id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const newRefreshToken = jwt.sign(
    { id: payload.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  const newHash = await bcrypt.hash(newRefreshToken, SALT);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1,$2, NOW() + interval '7 days')`,
    [payload.id, newHash]
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

//
// ==========================
// LOGOUT
// ==========================
//
async function logout(refreshToken) {
  if (!refreshToken) return;

  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE user_id = $1 AND revoked = false",
    [payload.id]
  );

  for (const record of result.rows) {
    const ok = await bcrypt.compare(refreshToken, record.token_hash);

    if (ok) {
      await pool.query(
        "UPDATE refresh_tokens SET revoked = true WHERE id = $1",
        [record.id]
      );
    }
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout
};