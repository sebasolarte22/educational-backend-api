const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const aiService = require("../services/aiService");

exports.explicarCurso = asyncHandler(async (req, res) => {

  const { titulo, categoria, nivel } = req.body;

  if (!titulo || !categoria || !nivel) {
    throw new AppError("Campos obligatorios faltantes", 400);
  }

  const result = await aiService.explicarCurso(
    { titulo, categoria, nivel },
    req.user.id
  );

  res.json({
    success: true,
    data: result
  });

});
