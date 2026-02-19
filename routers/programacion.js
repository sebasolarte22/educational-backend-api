const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const isAdminOrOwner = require("../middlewares/isAdminOrOwner");

const {
  getProgramacion,
  getProgramacionById,
  createProgramacion,
  updateProgramacion,
  deleteProgramacion
} = require("../controllers/programacion.controller");

// ==========================
router.get("/", getProgramacion);

router.get("/:id", getProgramacionById);

router.post("/", authMiddleware, createProgramacion);

router.put("/:id", authMiddleware, isAdminOrOwner, updateProgramacion);

router.delete("/:id", authMiddleware, isAdminOrOwner, deleteProgramacion);

module.exports = router;
