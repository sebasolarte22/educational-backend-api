const request = require("supertest");
const app = require("../app");

describe("GET /api/courses/programming", () => {

  test("Should return 200 and an array", async () => {
    const res = await request(app)
      .get("/api/courses/programming");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});