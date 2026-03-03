const pool = require("../config/db");

// ==========================
// GET LIST (ALL + CATEGORY)
// ==========================
async function getCourses({ category, filters = {}, sort, page = 1, limit = 10 }) {
  let query = `SELECT * FROM courses`;
  const params = [];
  const conditions = [];
  let i = 1;

  // Category opcional
  if (category) {
    conditions.push(`category = $${i++}`);
    params.push(category);
  }

  // Filters opcionales
  for (const key of Object.keys(filters)) {
    if (filters[key]) {
      conditions.push(`LOWER(${key}) = LOWER($${i++})`);
      params.push(filters[key]);
    }
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  // Sort
  query += sort === "views"
    ? " ORDER BY views DESC"
    : " ORDER BY id ASC";

  // Pagination
  const offset = (page - 1) * limit;
  query += ` LIMIT $${i++} OFFSET $${i++}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
}

// ==========================
// GET BY ID
// ==========================
async function getCourseById(id, category) {
  let query = `SELECT * FROM courses WHERE id=$1`;
  const params = [id];

  if (category) {
    query += ` AND category=$2`;
    params.push(category);
  }

  const result = await pool.query(query, params);
  return result.rows[0] || null;
}

// ==========================
// CREATE
// ==========================
async function createCourse(data) {
  const { title, category, level, views, created_by } = data;
  const field = category === "programming" ? "language" : "subject";

  const result = await pool.query(
    `INSERT INTO courses (title, category, ${field}, views, level, created_by)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [title, category, data[field], views || 0, level, created_by]
  );

  return result.rows[0];
}

// ==========================
// UPDATE
// ==========================
async function updateCourse({ id, category, data }) {
  const field = category === "programming" ? "language" : "subject";

  const result = await pool.query(
    `UPDATE courses
    SET title=$1, ${field}=$2, views=$3, level=$4
    WHERE id=$5 AND category=$6
    RETURNING *`,
    [data.title, data[field], data.views || 0, data.level, id, category]
  );

  return result.rows[0] || null;
}

// ==========================
// DELETE
// ==========================
async function deleteCourse(id, category) {
  const result = await pool.query(
    `DELETE FROM courses
    WHERE id=$1 AND category=$2
    RETURNING *`,
    [id, category]
  );

  return result.rows[0] || null;
}

// ==========================
// FULL STRUCTURE
// ==========================
async function getCourseFullStructure(courseId) {
  const result = await pool.query(
    `
    SELECT 
      c.id AS course_id,
      c.title AS course_title,
      c.category,
      c.level,
      s.id AS section_id,
      s.title AS section_title,
      s.position AS section_position,
      l.id AS lesson_id,
      l.title AS lesson_title,
      l.position AS lesson_position
    FROM courses c
    LEFT JOIN sections s ON s.course_id = c.id
    LEFT JOIN lessons l ON l.section_id = s.id
    WHERE c.id = $1
    ORDER BY s.position ASC, l.position ASC
    `,
    [courseId]
  );

  return result.rows;
}

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseFullStructure
};