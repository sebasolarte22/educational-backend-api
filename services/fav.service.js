const pool = require("../config/db");
const AppError = require("../utils/AppError");

// GET USER FAVORITES
async function getMyFavorites(userId) {
  const result = await pool.query(
    `SELECT c.*
    FROM favorites f
    JOIN courses c ON c.id = f.course_id
    WHERE f.user_id = $1
    ORDER BY f.created_at DESC`,
    [userId]
  );

  return result.rows;
}

// ADD FAVORITE
async function addFavorite(userId, courseId) {
  const result = await pool.query(
    `INSERT INTO favorites (user_id, course_id)
    VALUES ($1,$2)
    ON CONFLICT (user_id, course_id) DO NOTHING
    RETURNING *`,
    [userId, courseId]
  );

  return result.rows[0] || { message: "Already in favorites" };
}

// REMOVE FAVORITE
async function removeFavorite(userId, courseId) {
  const result = await pool.query(
    `DELETE FROM favorites
    WHERE user_id=$1 AND course_id=$2
    RETURNING *`,
    [userId, courseId]
  );

  if (result.rowCount === 0) {
    throw new AppError("Favorite not found", 404);
  }

  return { success: true };
}

module.exports = {
  addFavorite,
  getMyFavorites,
  removeFavorite
};