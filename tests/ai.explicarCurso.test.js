const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

describe("POST /api/ai/explicar-curso", () => {
  let adminToken;
  let userToken;
  let adminId;

  beforeAll(async () => {
    // Limpiar usuarios de prueba
    await pool.query(
      "DELETE FROM usuarios WHERE email IN ($1, $2)",
      ["admin_ia@test.com", "user_ia@test.com"]
    );

    // Crear usuario normal
    await request(app)
      .post("/api/cursos/auth/register")
      .send({
        email: "user_ia@test.com",
        password: "123456"
      });

    // Crear admin
    await request(app)
      .post("/api/cursos/auth/register")
      .send({
        email: "admin_ia@test.com",
        password: "123456"
      });

    // Hacer admin al segundo
    const adminRes = await pool.query(
      "UPDATE usuarios SET role='admin' WHERE email=$1 RETURNING id",
      ["admin_ia@test.com"]
    );
    adminId = adminRes.rows[0].id;

    // Login user
    const userLogin = await request(app)
      .post("/api/cursos/auth/login")
      .send({
        email: "user_ia@test.com",
        password: "123456"
      });

    userToken = userLogin.body.token;

    // Login admin
    const adminLogin = await request(app)
      .post("/api/cursos/auth/login")
      .send({
        email: "admin_ia@test.com",
        password: "123456"
      });

    adminToken = adminLogin.body.token;
  });

  afterAll(async () => {
    await pool.query(
      "DELETE FROM usuarios WHERE email IN ($1, $2)",
      ["admin_ia@test.com", "user_ia@test.com"]
    );
    await pool.end();
  });

  // ==========================
  // TESTS
  // ==========================

  test("rechaza acceso sin token", async () => {
    const res = await request(app)
      .post("/api/ai/explicar-curso")
      .send({});

    expect(res.statusCode).toBe(401);
  });

  test("rechaza usuario sin rol permitido", async () => {
    const res = await request(app)
      .post("/api/ai/explicar-curso")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        titulo: "Curso de JavaScript",
        categoria: "programacion",
        nivel: "basico"
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("admin puede usar IA (mock)", async () => {
    const res = await request(app)
      .post("/api/ai/explicar-curso")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        titulo: "Curso de JavaScript",
        categoria: "programacion",
        nivel: "basico"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("descripcion");
    expect(typeof res.body.data.descripcion).toBe("string");
  });
});
