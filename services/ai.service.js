const OpenAI = require("openai");
const pool = require("../config/db");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

const mode = process.env.AI_MODE || "mock";

let client = null;

if (mode === "real" && process.env.OPENAI_API_KEY) {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

//
// MOCK
//
async function explainCourseMock({ title, category, level }) {
  return {
    description: `This is a ${title} course designed for ${level} level students in the ${category} area. You will learn key fundamentals in a clear and practical way.`
  };
}

//
// REAL 
//
async function explainCourseReal({ title, category, level }) {
  if (!client) {
    throw new AppError("OpenAI client not configured", 500);
  }

  const prompt = `
You are an educational assistant.
Generate a clear short description of a course.

Data:
- Title: ${title}
- Category: ${category}
- Level: ${level}

Maximum 3 paragraphs.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional educational assistant." },
      { role: "user", content: prompt }
    ],
    temperature: 0.5,
    max_tokens: 300
  });

  const description = response.choices?.[0]?.message?.content;

  if (!description) {
    throw new AppError("Empty AI response", 500);
  }

  return { description };
}

//
// MAIN SERVICE
//
async function explainCourse(data, userId) {
  logger.info({
    event: "AI_REQUEST",
    userId,
    mode
  });

  try {
    const result =
      mode === "real"
        ? await explainCourseReal(data)
        : await explainCourseMock(data);

    // Save log
    await pool.query(
      `INSERT INTO ai_logs (user_id, endpoint, input_data, output_data, mode)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        "explain-course",
        JSON.stringify(data),
        result.description,
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

    throw new AppError("Could not generate description", 500);
  }
}

module.exports = {
  explainCourse
};