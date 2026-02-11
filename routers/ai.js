const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const aiService = require("../services/aiService");
const aiRateLimiter = require("../middlewares/aiRateLimiter");
const aiRoleMiddleware = require("../middlewares/aiRoleMiddleware");

// ==========================
// POST /api/ai/explicar-curso
// ==========================
router.post("/explicar-curso", authMiddleware, aiRoleMiddleware, aiRateLimiter, async (req, res) => {
  try {
    const { titulo, categoria, nivel } = req.body;

    // ==========================
    // VALIDACIONES
    // ==========================
    if (!titulo || !categoria || !nivel) {
      return res.status(400).json({
        success: false,
        error: "titulo, categoria y nivel son obligatorios"
      });
    }

    if (
      typeof titulo !== "string" ||
      typeof categoria !== "string" ||
      typeof nivel !== "string"
    ) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos"
      });
    }

    if (titulo.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: "titulo debe tener al menos 3 caracteres"
      });
    }

    const categoriasPermitidas = ["programacion", "matematicas"];
    const nivelesPermitidos = ["basico", "intermedio", "avanzado"];

    if (!categoriasPermitidas.includes(categoria.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: "categoria inválida"
      });
    }

    if (!nivelesPermitidos.includes(nivel.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: "nivel inválido"
      });
    }

    // ==========================
    // INPUT LIMPIO PARA IA
    // ==========================
    const inputIA = {
      titulo: titulo.trim(),
      categoria: categoria.toLowerCase(),
      nivel: nivel.toLowerCase()
    };

    const result = await aiService.explicarCurso(inputIA, req.user.id);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Error procesando IA"
    });
  }
});


module.exports = router;
