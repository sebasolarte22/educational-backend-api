const pool = require("../config/db");
const cache = require("../infrastructure/redis/cacheRepository");

// ==========================
// GET LIST (CON CACHE)
// ==========================
async function getCursos({ categoria, filters, ordenar, page, limit }) {

  const cacheKey = `courses:${categoria}:${JSON.stringify(filters)}:${ordenar}:${page}:${limit}`;

  const cached = await cache.get(cacheKey);

  if (cached) {
    console.log("🟢 CACHE HIT", cacheKey);
    return cached;
  }

  console.log("🔴 CACHE MISS", cacheKey);

  let query = `SELECT * FROM cursos WHERE categoria=$1`;
  const params = [categoria];
  let i = 2;

  if (filters) {
    for (const key of Object.keys(filters)) {
      if (filters[key]) {
        query += ` AND LOWER(${key})=LOWER($${i++})`;
        params.push(filters[key]);
      }
    }
  }

  query += ordenar === "vistas"
    ? " ORDER BY vistas DESC"
    : " ORDER BY id ASC";

  const offset = (page - 1) * limit;

  query += ` LIMIT $${i++} OFFSET $${i++}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  await cache.set(cacheKey, result.rows, 60);

  return result.rows;
}

// ==========================
// GET BY ID (CON CACHE)
// ==========================
async function getCursoById({ id, categoria }) {

  const cacheKey = `course:${categoria}:${id}`;

  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log("🟢 CACHE HIT ID", cacheKey);
    return cached;
  }

  console.log("🔴 CACHE MISS ID", cacheKey);

  const result = await pool.query(
    `SELECT * FROM cursos WHERE id=$1 AND categoria=$2`,
    [id, categoria]
  );

  const curso = result.rows[0] || null;

  if (curso) {
    await cache.set(cacheKey, curso, 120);
  }

  return curso;
}

// ==========================
// CREATE (INVALIDA LISTAS)
// ==========================
async function createCurso(data) {
  const { titulo, categoria, nivel, vistas, created_by } = data;

  const field = categoria === "programacion" ? "lenguaje" : "materia";

  const result = await pool.query(
    `INSERT INTO cursos (titulo, categoria, ${field}, vistas, nivel, created_by)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [titulo, categoria, data[field], vistas || 0, nivel, created_by]
  );

  // ⭐ invalidación profesional
  await cache.delByPattern(`courses:${categoria}:*`);

  return result.rows[0];
}

// ==========================
// UPDATE
// ==========================
async function updateCurso({ id, categoria, data }) {
  const field = categoria === "programacion" ? "lenguaje" : "materia";

  const result = await pool.query(
    `UPDATE cursos
     SET titulo=$1, ${field}=$2, vistas=$3, nivel=$4
     WHERE id=$5 AND categoria=$6
     RETURNING *`,
    [data.titulo, data[field], data.vistas || 0, data.nivel, id, categoria]
  );

  const curso = result.rows[0] || null;

  if (curso) {
    await cache.del(`course:${categoria}:${id}`);
    await cache.delByPattern(`courses:${categoria}:*`);
  }

  return curso;
}

// ==========================
// DELETE
// ==========================
async function deleteCurso({ id, categoria }) {
  const result = await pool.query(
    `DELETE FROM cursos
    WHERE id=$1 AND categoria=$2
    RETURNING *`,
    [id, categoria]
  );

  const curso = result.rows[0] || null;

  if (curso) {
    await cache.del(`course:${categoria}:${id}`);
    await cache.delByPattern(`courses:${categoria}:*`);
  }

  return curso;
}

module.exports = {
  getCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso
};