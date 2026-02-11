const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

describe("POST /api/cursos/auth/login", () => {

  // Usuario de prueba
  const user = {
    email: "login@test.com",
    password: "123456"
  };

  // Antes de todo: crear usuario
  beforeAll(async () => {
    await pool.query(
      "DELETE FROM usuarios WHERE email = $1",
      [user.email]
    );

    await request(app)
      .post("/api/cursos/auth/register")
      .send(user)
      .expect(201);
  });

  // Después de todo: limpiar DB
  afterAll(async () => {
    await pool.query(
      "DELETE FROM usuarios WHERE email = $1",
      [user.email]
    );
    await pool.end();
  });

  test("login exitoso devuelve token", async () => {
    const res = await request(app)
      .post("/api/cursos/auth/login")
      .send(user);

    console.log("LOGIN RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

});
