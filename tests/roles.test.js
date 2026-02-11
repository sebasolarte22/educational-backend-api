// tests/roles.test.js
require("dotenv").config();

const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const pool = require("../config/db");

let adminToken;
let userToken;

describe("Roles: admin vs user (MODELO B)", () => {

  beforeAll(async () => {
    await pool.query(
      `INSERT INTO usuarios (email, password, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [
        "user@test.com",
        await bcrypt.hash("123456", 10),
        "user"
      ]
    );

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

    const adminRes = await request(app)
      .post("/api/cursos/auth/login")
      .send({
        email: "sebastian2@test.com",
        password: "123456"
      });

    adminToken = adminRes.body.token;

    const userRes = await request(app)
      .post("/api/cursos/auth/login")
      .send({
        email: "user@test.com",
        password: "123456"
      });

    userToken = userRes.body.token;
  });

  test("USER sí puede crear un curso (201)", async () => {
    const res = await request(app)
      .post("/api/cursos/programacion")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        titulo: "Curso USER",
        lenguaje: "JS",
        nivel: "Basico"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("ADMIN sí puede crear un curso (201)", async () => {
    const res = await request(app)
      .post("/api/cursos/programacion")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        titulo: "Curso ADMIN",
        lenguaje: "JS",
        nivel: "Basico"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

});
