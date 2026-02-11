// tests/protected.test.js
require("dotenv").config();

const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const pool = require("../config/db");

let token;

describe("Rutas protegidas con JWT", () => {

  beforeAll(async () => {
    await pool.query(
      `INSERT INTO usuarios (email, password, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [
        "protected@test.com",
        await bcrypt.hash("123456", 10),
        "user"
      ]
    );

    const res = await request(app)
      .post("/api/cursos/auth/login")
      .send({
        email: "protected@test.com",
        password: "123456"
      });

    token = res.body.token;
  });

  test("POST sin token debe devolver 401", async () => {
    const res = await request(app)
      .post("/api/cursos/programacion")
      .send({
        titulo: "Curso sin token",
        lenguaje: "JS",
        nivel: "Basico"
      });

    expect(res.statusCode).toBe(401);
  });

  test("POST con token inválido debe devolver 401", async () => {
    const res = await request(app)
      .post("/api/cursos/programacion")
      .set("Authorization", "Bearer token_invalido")
      .send({
        titulo: "Curso token malo",
        lenguaje: "JS",
        nivel: "Basico"
      });

    expect(res.statusCode).toBe(401);
  });

  test("POST con token válido debe devolver 201", async () => {
    const res = await request(app)
      .post("/api/cursos/programacion")
      .set("Authorization", `Bearer ${token}`)
      .send({
        titulo: "Curso con token válido",
        lenguaje: "JS",
        nivel: "Basico"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

});
