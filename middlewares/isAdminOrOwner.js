const pool = require("../config/db");

async function isAdminOrOwner(req, res, next) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { id } = req.params; // id del curso

    // Admin puede todo
    if (userRole === "admin") {
      return next();
    }

    // Validar ID del curso
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Buscar curso
    const result = await pool.query(
      `SELECT created_by FROM cursos WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const curso = result.rows[0];

    // Verificar si es dueño
    if (curso.created_by !== userId) {
      return res.status(403).json({
        error: "No tienes permisos para modificar este recurso"
      });
    }

    // Es dueño → permitir
    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al validar permisos" });
  }
}

module.exports = isAdminOrOwner;
