const pool = require("../config/db");

async function findEnrollment(userId, courseId) {
  const result = await pool.query(
    `SELECT * FROM enrollments WHERE user_id=$1 AND course_id=$2`,
    [userId, courseId]
  );
  return result.rows[0] || null;
}

async function createEnrollment(userId, courseId) {
  const result = await pool.query(
    `INSERT INTO enrollments (user_id, course_id)
    VALUES ($1,$2)
    ON CONFLICT (user_id, course_id) DO NOTHING
    RETURNING *`,
    [userId, courseId]
  );

  return result.rows[0] || null;
}

async function getUserEnrollments(userId) {
  const result = await pool.query(
    `SELECT e.*, c.title, c.category
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE e.user_id=$1
    ORDER BY e.created_at DESC`,
    [userId]
  );

  return result.rows;
}

module.exports = {
  findEnrollment,
  createEnrollment,
  getUserEnrollments
};