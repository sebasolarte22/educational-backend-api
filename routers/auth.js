const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const pool = require("../config/db");

const {
  generateAccessToken,
  generateRefreshToken,
  hashToken
} = require("../utils/tokens");


// ==========================
// REGISTER - crear usuario
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password son obligatorios"
      });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    if (email.trim() === "") {
      return res.status(400).json({ error: "Email vacío" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password debe tener al menos 6 caracteres"
      });
    }

    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (existe.rowCount > 0) {
      return res.status(409).json({
        error: "El usuario ya existe"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (email, password)
      VALUES ($1, $2)
      RETURNING id, email, role`,
      [email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});


// ==========================
// LOGIN
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password son obligatorios"
      });
    }

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        error: "Credenciales inválidas"
      });
    }

    const usuario = result.rows[0];

    const passwordValido = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordValido) {
      return res.status(401).json({
        error: "Credenciales inválidas"
      });
    }

    // 🔐 TOKENS
    const accessToken = generateAccessToken(usuario);
    const refreshToken = generateRefreshToken(usuario);
    const refreshHash = hashToken(refreshToken);

    // Guardar refresh token hasheado
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [usuario.id, refreshHash]
    );

    // Cookie httpOnly
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true en producción
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ token: accessToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});


// ==========================
// REFRESH TOKEN
// ==========================
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token requerido"
      });
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
      return res.status(401).json({
        error: "Refresh token inválido"
      });
    }

    // 🔄 ROTACIÓN
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

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ token: newAccessToken });

  } catch (err) {
    return res.status(401).json({
      error: "Refresh token expirado o inválido"
    });
  }
});


// ==========================
// LOGOUT
// ==========================
router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await pool.query(
        `UPDATE refresh_tokens
        SET revoked = true
        WHERE token_hash = $1`,
        [tokenHash]
      );
    }

    res.clearCookie("refreshToken");
    res.json({ message: "Sesión cerrada" });

  } catch (err) {
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
});

module.exports = router;

