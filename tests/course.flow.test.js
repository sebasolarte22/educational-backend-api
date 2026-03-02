require("dotenv").config();

const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const pool = require("../config/db");

describe("FULL COURSE FLOW (Enrollment + Lessons + Progress)", () => {

  let token;
  let courseId;
  let sectionId;
  let lessonId;

  beforeAll(async () => {
    // 🔥 Limpiar toda la base
    await pool.query(`
      TRUNCATE TABLE
        lesson_progress,
        lessons,
        sections,
        enrollments,
        favorites,
        refresh_tokens,
        courses,
        users
      RESTART IDENTITY CASCADE;
    `);

    // 🔐 Crear usuario dinámico
    const hashed = await bcrypt.hash("123456", 10);
    const email = `flow_${Date.now()}@test.com`;

    await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)`,
      [email, hashed, "admin"]
    );

    // 🔑 Login
    const loginRes = await request(app)
      .post("/api/courses/auth/login")
      .send({
        email,
        password: "123456"
      });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await pool.end();
  });

  test("1️⃣ Create Course", async () => {
    const res = await request(app)
      .post("/api/courses/programming")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Node Advanced",
        language: "javascript",
        level: "advanced"
      });

    expect(res.statusCode).toBe(201);
    courseId = res.body.id;
  });

  test("2️⃣ Create Section", async () => {
    const res = await request(app)
      .post("/api/sections")
      .set("Authorization", `Bearer ${token}`)
      .send({
        course_id: courseId,
        title: "Intro",
        position: 1
      });

    expect(res.statusCode).toBe(201);
    sectionId = res.body.id;
  });

  test("3️⃣ Create Lesson", async () => {
    const res = await request(app)
      .post("/api/lessons")
      .set("Authorization", `Bearer ${token}`)
      .send({
        section_id: sectionId,
        title: "What is Node?",
        position: 1
      });
    
    ("CREATE LESSON RESPONSE:", res.body);
    expect(res.statusCode).toBe(201);
    lessonId = res.body.id;
  });

  test("4️⃣ Enroll User", async () => {
    const res = await request(app)
      .post(`/api/enrollment/${courseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
  });

  test("5️⃣ Get Full Course (0% progress)", async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/full`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.progress).toBe(0);
    expect(res.body.sections[0].lessons[0].completed).toBe(false);
  });

  test("6️⃣ Complete Lesson", async () => {
    const res = await request(app)
      .post("/api/progress/complete-lesson")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lessonId,
        courseId
      });
    console.log("COMPLETE LESSON RESPONSE:", res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.progress).toBe(100);
  });

  test("7️⃣ Get Full Course (100% progress)", async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/full`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.progress).toBe(100);
    expect(res.body.completed_course).toBe(true);
    expect(res.body.sections[0].lessons[0].completed).toBe(true);
  });

});