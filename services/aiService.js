const OpenAI = require("openai");
const pool = require("../config/db");

const mode = process.env.AI_MODE || "mock";

let client = null;

// ==========================
// CLIENTE OPENAI (solo en modo real)
// ==========================
if (mode === "real") {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// ==========================
// IA MOCK (DESARROLLO / TESTS)
// ==========================
async function explicarCursoMock({ titulo, categoria, nivel }) {
  return {
    descripcion: `Este es un curso de ${titulo}, orientado a personas con nivel ${nivel} en el área de ${categoria}. En este curso aprenderás los fundamentos clave de manera clara y práctica, con ejemplos sencillos y ejercicios aplicados.`
  };
}

// ==========================
// IA REAL (OPENAI)
// ==========================
async function explicarCursoReal({ titulo, categoria, nivel }) {
  const prompt = `
Eres un asistente educativo.
Genera una descripción clara y breve de un curso.

Datos del curso:
- Título: ${titulo}
- Categoría: ${categoria}
- Nivel: ${nivel}

Reglas:
- Usa lenguaje claro
- Máximo 3 párrafos
- No menciones que eres una IA
- No inventes requisitos
- No uses emojis
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
    throw new Error("Respuesta vacía de la IA");
  }

  return { descripcion };
}

// ==========================
// FUNCIÓN PÚBLICA (CORE)
// ==========================
async function explicarCurso(data, userId) {
  try {
    console.log("Revisando cache IA");
    // ==========================
    // CACHE POR INPUT (solo en real)
    // ==========================
    if (mode === "real") {
      const cached = await pool.query(
        `SELECT output
        FROM ai_logs
        WHERE endpoint = $1
        AND input = $2
        AND mode = 'real'
        ORDER BY created_at DESC
        LIMIT 1`,
        ["explicar-curso", JSON.stringify(data)]
      );

      if (cached.rowCount > 0) {
        return { descripcion: cached.rows[0].output };
        console.log("✅ RESPUESTA DESDE CACHE (sin IA)");
      }
    }

    // ==========================
    // EJECUTAR IA (real o mock)
    // ==========================
    console.log("🚀 LLAMANDO IA REAL");
    const result =
      mode === "real"
        ? await explicarCursoReal(data)
        : await explicarCursoMock(data);

    // ==========================
    // GUARDAR HISTORIAL EN DB
    // ==========================
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

    return result;

  } catch (err) {
    console.error("ERROR IA:", err.message);
    throw new Error("No se pudo generar la descripción");
  }
}

module.exports = {
  explicarCurso
};
