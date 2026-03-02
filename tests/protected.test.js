const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

// MOCK AI SERVICE
jest.mock("../services/ai.service", () => ({
  explainCourse: jest.fn().mockResolvedValue({
    description: "AI course explanation (mock)"
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

    // Register normal user
    await request(app)
      .post("/api/courses/auth/register")
      .send({
        email: "user_ai@test.com",
        password: "123456"
      });

    // Register admin
    await request(app)
      .post("/api/courses/auth/register")
      .send({
        email: "admin_ai@test.com",
        password: "123456"
      });

    // Promote admin
    await pool.query(
      "UPDATE users SET role='admin' WHERE email=$1",
      ["admin_ai@test.com"]
    );

    const userLogin = await request(app)
      .post("/api/courses/auth/login")
      .send({
        email: "user_ai@test.com",
        password: "123456"
      });

    userToken = userLogin.body.token;

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

  test("rejects request without token", async () => {
    const res = await request(app)
      .post("/api/ai/explain-course")
      .send({});

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("rejects user without allowed role", async () => {
    const res = await request(app)
      .post("/api/ai/explain-course")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "JS Course",
        category: "programming",
        level: "basic"
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("admin can use AI (mock)", async () => {
    const res = await request(app)
      .post("/api/ai/explain-course")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "JS Course",
        category: "programming",
        level: "basic"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("description");
    expect(typeof res.body.data.description).toBe("string");
  });

});