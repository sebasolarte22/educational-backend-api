// tests/auth.test.js
require("dotenv").config();

const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const pool = require("../config/db");

describe("AUTH - Login", () => {

  beforeAll(async () => {
    await pool.query(
      `INSERT INTO usuarios (email, password, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [
        "sebastian2@test.com",
        await bcrypt.hash("123456", 10),
        "admin"
      ]
    );
  });

  test("Login correcto debe devolver un token", async () => {
    const res = await request(app)
      .post("/api/cursos/auth/login")
      .send({
        email: "sebastian2@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Login con password incorrecto debe fallar", async () => {
    const res = await request(app)
      .post("/api/cursos/auth/login")
      .send({
        email: "sebastian2@test.com",
        password: "malpassword"
      });

    expect(res.statusCode).toBe(401);
  });

});
