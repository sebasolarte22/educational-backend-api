require("dotenv").config();

const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const pool = require("../config/db");

describe("AUTH - Refresh Tokens", () => {

  const agent = request.agent(app);
  let accessToken;

  beforeAll(async () => {
    await pool.query(
      `INSERT INTO usuarios (email, password, role)
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
    await pool.end();
  });

  test("Login guarda refresh token y devuelve access token", async () => {
    const res = await agent
      .post("/api/cursos/auth/login")
      .send({
        email: "refresh@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");

    accessToken = res.body.token;
  });

  test("Refresh devuelve nuevo access token", async () => {
    const res = await agent
      .post("/api/cursos/auth/refresh");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

});
