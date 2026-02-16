require("dotenv").config();

const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

describe("POST /api/cursos/auth/login", () => {

  const user = {
    email: "login@test.com",
    password: "123456"
  };

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

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

});
