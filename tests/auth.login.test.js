const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

describe("POST /api/courses/auth/login", () => {

  const user = {
    email: "login@test.com",
    password: "123456"
  };

  beforeAll(async () => {
    // Clean user if exists
    await pool.query(
      "DELETE FROM users WHERE email = $1",
      [user.email]
    );

    // Register user first
    await request(app)
      .post("/api/courses/auth/register")
      .send(user)
      .expect(201);
  });

  afterAll(async () => {
    await pool.query(
      "DELETE FROM users WHERE email = $1",
      [user.email]
    );
  });

  test("Successful login should return token", async () => {
    const res = await request(app)
      .post("/api/courses/auth/login")
      .send(user);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

});