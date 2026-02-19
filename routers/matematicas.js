const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const isAdminOrOwner = require("../middlewares/isAdminOrOwner");

const {
  getMatematicas,
  getMatematicasById,
  createMatematicas,
  updateMatematicas,
  deleteMatematicas
} = require("../controllers/matematicas.controller");

router.get("/", getMatematicas);
router.get("/:id", getMatematicasById);
router.post("/", authMiddleware, createMatematicas);
router.put("/:id", authMiddleware, isAdminOrOwner, updateMatematicas);
router.delete("/:id", authMiddleware, isAdminOrOwner, deleteMatematicas);

module.exports = router;
