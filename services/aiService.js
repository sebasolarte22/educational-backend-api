const OpenAI = require("openai");
const pool = require("../config/db");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

const mode = process.env.AI_MODE || "mock";

let client = null;

if (mode === "real") {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

async function explicarCursoMock({ titulo, categoria, nivel }) {
  return {
    descripcion: `Este es un curso de ${titulo}, orientado a personas con nivel ${nivel} en el área de ${categoria}. En este curso aprenderás los fundamentos clave de manera clara y práctica.`
  };
}

async function explicarCursoReal({ titulo, categoria, nivel }) {
  const prompt = `
Eres un asistente educativo.
Genera una descripción clara y breve de un curso.

Datos:
- Título: ${titulo}
- Categoría: ${categoria}
- Nivel: ${nivel}

Máximo 3 párrafos.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Eres un asistente educativo profesional." },
      { role: "user", content: prompt }
    ],
    temperature: 0.5,
    max_tokens: 300
  });

  const descripcion = response.choices[0]?.message?.content;

  if (!descripcion) {
    throw new AppError("Respuesta vacía de la IA", 500);
  }

  return { descripcion };
}

async function explicarCurso(data, userId) {

  logger.info({
    event: "AI_REQUEST",
    userId,
    mode
  });

  if (mode === "real") {
    const cached = await pool.query(
      `SELECT output FROM ai_logs
      WHERE endpoint = $1
      AND input = $2
      AND mode = 'real'
      ORDER BY created_at DESC
      LIMIT 1`,
      ["explicar-curso", JSON.stringify(data)]
    );

    if (cached.rowCount > 0) {
      logger.info({
        event: "AI_CACHE_HIT",
        userId
      });

      return { descripcion: cached.rows[0].output };
    }
  }

  try {
    const result =
      mode === "real"
        ? await explicarCursoReal(data)
        : await explicarCursoMock(data);

    await pool.query(
      `INSERT INTO ai_logs (user_id, endpoint, input, output, mode)
      VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        "explicar-curso",
        JSON.stringify(data),
        result.descripcion,
        mode
      ]
    );

    logger.info({
      event: "AI_RESPONSE_SAVED",
      userId
    });

    return result;

  } catch (err) {
    logger.error({
      event: "AI_ERROR",
      message: err.message,
      stack: err.stack
    });

    throw new AppError("No se pudo generar la descripción", 500);
  }
}

module.exports = {
  explicarCurso
};
