const pool = require("../config/db");

async function createSection({ course_id, title, position }) {
  const result = await pool.query(
    `INSERT INTO sections (course_id, title, position)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [course_id, title, position]
  );

  return result.rows[0];
}

async function getSectionsByCourse(courseId) {
  const result = await pool.query(
    `SELECT *
    FROM sections
    WHERE course_id = $1
    ORDER BY position ASC`,
    [courseId]
  );

  return result.rows;
}

async function deleteSection(id) {
  const result = await pool.query(
    `DELETE FROM sections
    WHERE id = $1
    RETURNING *`,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createSection,
  getSectionsByCourse,
  deleteSection
};