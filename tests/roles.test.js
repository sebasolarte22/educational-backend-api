require("dotenv").config();

const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const pool = require("../config/db");

let adminToken;
let userToken;

describe("Roles: admin vs user", () => {

  beforeAll(async () => {

    await pool.query(
      `INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING`,
      ["user@test.com", await bcrypt.hash("123456", 10), "user"]
    );

    await pool.query(
      `INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING`,
      ["admin@test.com", await bcrypt.hash("123456", 10), "admin"]
    );

    const adminRes = await request(app)
      .post("/api/courses/auth/login")
      .send({ email: "admin@test.com", password: "123456" });

    adminToken = adminRes.body.token;

    const userRes = await request(app)
      .post("/api/courses/auth/login")
      .send({ email: "user@test.com", password: "123456" });

    userToken = userRes.body.token;
  });

  // Clean courses created by tests
  afterEach(async () => {
    await pool.query(
      "DELETE FROM courses WHERE title LIKE 'Course%'"
    );
  });

  afterAll(async () => {
    await pool.query(
      "DELETE FROM users WHERE email IN ($1,$2)",
      ["user@test.com", "admin@test.com"]
    );
  });

  test("USER can create course", async () => {
    const res = await request(app)
      .post("/api/courses/programming")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Course USER",
        language: "JS",
        level: "Basic"
      });

    expect(res.statusCode).toBe(201);
  });

  test("ADMIN can create course", async () => {
    const res = await request(app)
      .post("/api/courses/programming")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Course ADMIN",
        language: "JS",
        level: "Basic"
      });

    expect(res.statusCode).toBe(201);
  });

});