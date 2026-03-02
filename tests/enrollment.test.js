const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const pool = require("../config/db");

describe("Enrollment Flow", () => {
  let token;
  let userId;
  let courseId;

  beforeEach(async () => {
    // 🔥 Generar email único SIEMPRE
    const email = `test_${Date.now()}_${Math.random()}@test.com`;

    // Crear usuario
    const userRes = await pool.query(
      `INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [email, "hashed", "user"]
    );

    userId = userRes.rows[0].id;

    // Crear curso
    const courseRes = await pool.query(
      `INSERT INTO courses (title, category, created_by)
      VALUES ($1, $2, $3)
      RETURNING *`,
      ["Node Course", "programming", userId]
    );

    courseId = courseRes.rows[0].id;

    // Generar token válido
    token = jwt.sign(
      { id: userId, role: "user" },
      process.env.JWT_ACCESS_SECRET
    );
  });

  test("User can enroll in course", async () => {
    const res = await request(app)
      .post(`/api/enrollment/${courseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.course_id).toBe(courseId);
  });

  test("Enrollment is idempotent (no duplicate)", async () => {
    await request(app)
      .post(`/api/enrollment/${courseId}`)
      .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
      .post(`/api/enrollment/${courseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);

    const check = await pool.query(
      `SELECT * FROM enrollments 
      WHERE user_id=$1 AND course_id=$2`,
      [userId, courseId]
    );

    expect(check.rowCount).toBe(1);
  });

  test("User cannot save progress if NOT enrolled", async () => {
    const res = await request(app)
      .post(`/api/progress/${courseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ progress: 50 });

    expect(res.statusCode).toBe(403);
  });

  test("User CAN save progress after enrollment", async () => {
    await request(app)
      .post(`/api/enrollment/${courseId}`)
      .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
      .post(`/api/progress/${courseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ progress: 50 });

    expect(res.statusCode).toBe(200);
    expect(res.body.progress).toBe(50);
  });
});