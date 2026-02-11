// tests/refresh.test.js
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

  test("Refresh devuelve un access token válido", async () => {
    const res = await agent
      .post("/api/cursos/auth/refresh");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");

    accessToken = res.body.token;
  });

  test("Access token refrescado funciona en ruta protegida", async () => {
    const res = await request(app)
      .post("/api/cursos/programacion")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        titulo: "Curso con token refrescado",
        lenguaje: "JS",
        nivel: "Basico"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

});
