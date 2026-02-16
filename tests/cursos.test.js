require("dotenv").config();

const request = require("supertest");
const app = require("../app");

describe("GET /api/cursos/programacion", () => {

  test("Debe devolver 200 y un array", async () => {
    const res = await request(app)
      .get("/api/cursos/programacion");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
