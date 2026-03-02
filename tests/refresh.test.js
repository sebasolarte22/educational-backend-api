const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const pool = require("../config/db");

describe("AUTH — Refresh Tokens", () => {

  const agent = request.agent(app);
  let accessToken;

  beforeAll(async () => {
    await pool.query(
      `INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING`,
      [
        "refresh@test.com",
        await bcrypt.hash("123456", 10),
        "user"
      ]
    );
  });

  afterAll(async () => {
    await pool.query(
      "DELETE FROM users WHERE email = $1",
      ["refresh@test.com"]
    );
  });

  test("Login stores refresh token and returns access token", async () => {
    const res = await agent
      .post("/api/courses/auth/login")
      .send({
        email: "refresh@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");

    accessToken = res.body.token;
  });

  test("Refresh returns new access token", async () => {
    const res = await agent
      .post("/api/courses/auth/refresh");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

});