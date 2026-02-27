const pool = require("../config/db");
const AppError = require("../utils/AppError");

// GET USER PROGRESS (all courses)
async function getUserProgress(userId) {
  const result = await pool.query(
    `SELECT cp.*, c.title, c.category
    FROM course_progress cp
    JOIN courses c ON c.id = cp.course_id
    WHERE cp.user_id = $1
    ORDER BY cp.updated_at DESC`,
    [userId]
  );

  return result.rows;
}

// GET ONE COURSE PROGRESS
async function getCourseProgress(userId, courseId) {
  const result = await pool.query(
    `SELECT *
    FROM course_progress
    WHERE user_id=$1 AND course_id=$2`,
    [userId, courseId]
  );

  return result.rows[0] || null;
}

// UPSERT PROGRESS (create or update)
async function saveProgress(userId, courseId, data) {
  const { progress = 0, last_position = 0, completed = false } = data;

  const result = await pool.query(
    `INSERT INTO course_progress (user_id, course_id, progress, last_position, completed)
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (user_id, course_id)
    DO UPDATE SET
    progress = EXCLUDED.progress,
    last_position = EXCLUDED.last_position,
    completed = EXCLUDED.completed,
    updated_at = now()
     RETURNING *`,
    [userId, courseId, progress, last_position, completed]
  );

  return result.rows[0];
}

// MARK COMPLETE
async function markCompleted(userId, courseId) {
  const result = await pool.query(
    `UPDATE course_progress
    SET completed=true, progress=100, updated_at=now()
    WHERE user_id=$1 AND course_id=$2
    RETURNING *`,
    [userId, courseId]
  );

  if (result.rowCount === 0) {
    throw new AppError("Progress not found", 404);
  }

  return result.rows[0];
}

module.exports = {
  getUserProgress,
  getCourseProgress,
  saveProgress,
  markCompleted
};