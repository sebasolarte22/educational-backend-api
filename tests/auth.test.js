const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const pool = require("../config/db");

describe("AUTH - Login", () => {

  beforeAll(async () => {
    await pool.query(
      `INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING`,
      [
        "sebastian2@test.com",
        await bcrypt.hash("123456", 10),
        "admin"
      ]
    );
  });

  test("Valid login should return token", async () => {
    const res = await request(app)
      .post("/api/courses/auth/login")
      .send({
        email: "sebastian2@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Invalid password should fail", async () => {
    const res = await request(app)
      .post("/api/courses/auth/login")
      .send({
        email: "sebastian2@test.com",
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe("fail");
  });

});