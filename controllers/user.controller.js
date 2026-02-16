const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

// ==========================
// CREATE USER
// ==========================
exports.createUser = asyncHandler(async (req, res) => {

  const { name, email } = req.body;

  if (!name || !email) {
    throw new AppError("name y email son obligatorios", 400);
  }

  if (typeof name !== "string" || typeof email !== "string") {
    throw new AppError("Datos inválidos", 400);
  }

  if (name.trim() === "" || email.trim() === "") {
    throw new AppError("Campos vacíos no permitidos", 400);
  }

  // Aquí iría la lógica real con DB
  logger.info({
    event: "USER_CREATED",
    name: name.trim(),
    email: email.trim()
  });

  res.status(201).json({
    message: "Usuario creado correctamente",
    user: {
      name: name.trim(),
      email: email.trim()
    }
  });

});
