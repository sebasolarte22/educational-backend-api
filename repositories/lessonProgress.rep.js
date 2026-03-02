const pool = require("../config/db");

// Marcar lesson como completada
async function markLessonCompleted(userId, lessonId) {
  const result = await pool.query(
    `INSERT INTO lesson_progress (user_id, lesson_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, lesson_id)
    DO UPDATE SET completed = true, completed_at = now()
    RETURNING *`,
    [userId, lessonId]
  );

  return result.rows[0];
}

// Obtener IDs de lessons completadas por usuario en un curso
async function getCompletedLessonIds(userId, courseId) {
  const result = await pool.query(
    `
    SELECT lp.lesson_id
    FROM lesson_progress lp
    JOIN lessons l ON l.id = lp.lesson_id
    JOIN sections s ON s.id = l.section_id
    WHERE lp.user_id = $1
    AND s.course_id = $2
    `,
    [userId, courseId]
  );

  return result.rows.map(r => r.lesson_id);
}

// Contar total lessons del curso
async function countTotalLessons(courseId) {
  const result = await pool.query(
    `
    SELECT COUNT(l.id) AS total
    FROM lessons l
    JOIN sections s ON s.id = l.section_id
    WHERE s.course_id = $1
    `,
    [courseId]
  );

  return parseInt(result.rows[0].total);
}

module.exports = {
  markLessonCompleted,
  getCompletedLessonIds,
  countTotalLessons
};