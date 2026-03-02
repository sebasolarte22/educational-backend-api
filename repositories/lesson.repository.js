const pool = require("../config/db");

async function createLesson({ section_id, title, content, video_url, position }) {
  const result = await pool.query(
    `INSERT INTO lessons (section_id, title, content, video_url, position)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [section_id, title, content || null, video_url || null, position]
  );

  return result.rows[0];
}

async function getLessonsBySection(sectionId) {
  const result = await pool.query(
    `SELECT *
    FROM lessons
    WHERE section_id = $1
    ORDER BY position ASC`,
    [sectionId]
  );

  return result.rows;
}

async function getLessonById(id) {
  const result = await pool.query(
    `SELECT *
    FROM lessons
    WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function deleteLesson(id) {
  const result = await pool.query(
    `DELETE FROM lessons
    WHERE id = $1
    RETURNING *`,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createLesson,
  getLessonsBySection,
  getLessonById,
  deleteLesson
};