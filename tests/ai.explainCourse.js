require("dotenv").config();

const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

// MOCK AI SERVICE
jest.mock("../services/ai.service", () => ({
  explainCourse: jest.fn().mockResolvedValue({
    description: "AI generated description (mock)"
  })
}));

describe("POST /api/ai/explain-course", () => {

  let adminToken;
  let userToken;

  beforeAll(async () => {

    await pool.query(
      "DELETE FROM users WHERE email IN ($1,$2)",
      ["admin_ai@test.com", "user_ai@test.com"]
    );

    // register user
    await request(app)
      .post("/api/courses/auth/register")
      .send({
        email: "user_ai@test.com",
        password: "123456"
      });

    // register admin
    await request(app)
      .post("/api/courses/auth/register")
      .send({
        email: "admin_ai@test.com",
        password: "123456"
      });

    // make admin
    await pool.query(
      "UPDATE users SET role='admin' WHERE email=$1",
      ["admin_ai@test.com"]
    );

    // login user
    const userLogin = await request(app)
      .post("/api/courses/auth/login")
      .send({
        email: "user_ai@test.com",
        password: "123456"
      });

    userToken = userLogin.body.token;

    // login admin
    const adminLogin = await request(app)
      .post("/api/courses/auth/login")
      .send({
        email: "admin_ai@test.com",
        password: "123456"
      });

    adminToken = adminLogin.body.token;
  });

  afterAll(async () => {
    await pool.query(
      "DELETE FROM users WHERE email IN ($1,$2)",
      ["admin_ai@test.com", "user_ai@test.com"]
    );
  });

  test("rejects without token", async () => {
    const res = await request(app)
      .post("/api/ai/explain-course")
      .send({});

    expect(res.statusCode).toBe(401);
  });

  test("rejects user without role", async () => {
    const res = await request(app)
      .post("/api/ai/explain-course")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "JS Course",
        category: "programming",
        level: "basic"
      });

    expect(res.statusCode).toBe(403);
  });

  test("admin can use AI", async () => {
    const res = await request(app)
      .post("/api/ai/explain-course")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "JS Course",
        category: "programming",
        level: "basic"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("description");
  });

});