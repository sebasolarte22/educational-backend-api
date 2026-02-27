const pool = require("../config/db");
const cache = require("../infrastructure/redis/cacheRepository");
const logger = require("../utils/logger");

// =====================================================
// GET LIST (WITH CACHE)
// =====================================================
async function getCourses({ category, filters, sort, page, limit }) {
  const cacheKey = `courses:${category}:${JSON.stringify(filters)}:${sort}:${page}:${limit}`;

  const cached = await cache.get(cacheKey);

  if (cached) {
    logger.debug({ event: "CACHE_HIT", cacheKey });
    return cached;
  }

  logger.debug({ event: "CACHE_MISS", cacheKey });

  let query = `SELECT * FROM courses WHERE category=$1`;
  const params = [category];
  let i = 2;

  if (filters) {
    for (const key of Object.keys(filters)) {
      if (filters[key]) {
        query += ` AND LOWER(${key})=LOWER($${i++})`;
        params.push(filters[key]);
      }
    }
  }

  query += sort === "views"
    ? " ORDER BY views DESC"
    : " ORDER BY id ASC";

  const offset = (page - 1) * limit;

  query += ` LIMIT $${i++} OFFSET $${i++}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  await cache.set(cacheKey, result.rows, 60);

  return result.rows;
}

// =====================================================
// GET BY ID (WITH CACHE)
// =====================================================
async function getCourseById({ id, category }) {
  const cacheKey = `course:${category}:${id}`;

  const cached = await cache.get(cacheKey);

  if (cached) {
    logger.debug({ event: "CACHE_HIT_ID", cacheKey });
    return cached;
  }

  logger.debug({ event: "CACHE_MISS_ID", cacheKey });

  const result = await pool.query(
    `SELECT * FROM courses WHERE id=$1 AND category=$2`,
    [id, category]
  );

  const course = result.rows[0] || null;

  if (course) {
    await cache.set(cacheKey, course, 120);
  }

  return course;
}

// =====================================================
// CREATE (INVALIDATE LIST CACHE)
// =====================================================
async function createCourse(data) {
  const { title, category, level, views, created_by } = data;

  const field = category === "programming" ? "language" : "subject";

  const result = await pool.query(
    `INSERT INTO courses (title, category, ${field}, views, level, created_by)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [title, category, data[field], views || 0, level, created_by]
  );

  await cache.delByPattern(`courses:${category}:*`);

  logger.debug({
    event: "CACHE_INVALIDATION_LIST",
    category
  });

  return result.rows[0];
}

// =====================================================
// UPDATE (PUT)
// =====================================================
async function updateCourse({ id, category, data }) {
  const field = category === "programming" ? "language" : "subject";

  const result = await pool.query(
    `UPDATE courses
    SET title=$1, ${field}=$2, views=$3, level=$4
    WHERE id=$5 AND category=$6
    RETURNING *`,
    [data.title, data[field], data.views || 0, data.level, id, category]
  );

  const course = result.rows[0] || null;

  if (course) {
    await cache.del(`course:${category}:${id}`);
    await cache.delByPattern(`courses:${category}:*`);

    logger.debug({
      event: "CACHE_INVALIDATION_UPDATE",
      id,
      category
    });
  }

  return course;
}

// =====================================================
// PATCH (PARTIAL UPDATE)
// =====================================================
async function patchCourse({ id, category, data }) {
  const field = category === "programming" ? "language" : "subject";

  const fields = [];
  const params = [];
  let i = 1;

  if (data.title !== undefined) {
    fields.push(`title=$${i++}`);
    params.push(data.title);
  }

  if (data[field] !== undefined) {
    fields.push(`${field}=$${i++}`);
    params.push(data[field]);
  }

  if (data.views !== undefined) {
    fields.push(`views=$${i++}`);
    params.push(data.views);
  }

  if (data.level !== undefined) {
    fields.push(`level=$${i++}`);
    params.push(data.level);
  }

  if (fields.length === 0) return null;

  params.push(id, category);

  const result = await pool.query(
    `UPDATE courses
    SET ${fields.join(", ")}
    WHERE id=$${i++} AND category=$${i}
    RETURNING *`,
    params
  );

  const course = result.rows[0] || null;

  if (course) {
    await cache.del(`course:${category}:${id}`);
    await cache.delByPattern(`courses:${category}:*`);

    logger.debug({
      event: "CACHE_INVALIDATION_PATCH",
      id,
      category
    });
  }

  return course;
}

// =====================================================
// DELETE
// =====================================================
async function deleteCourse({ id, category }) {
  const result = await pool.query(
    `DELETE FROM courses
    WHERE id=$1 AND category=$2
    RETURNING *`,
    [id, category]
  );

  const course = result.rows[0] || null;

  if (course) {
    await cache.del(`course:${category}:${id}`);
    await cache.delByPattern(`courses:${category}:*`);

    logger.debug({
      event: "CACHE_INVALIDATION_DELETE",
      id,
      category
    });
  }

  return course;
}

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  patchCourse,
  deleteCourse
};