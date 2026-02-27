const OpenAI = require("openai");
const pool = require("../config/db");

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function explainCourse({ title, category, level }, userId) {
  let description;

  if (openai) {
    const completion = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: `Create a concise educational course description. Title: ${title}. Category: ${category}. Level: ${level}. Return plain text only.`
    });

    description = completion.output_text?.trim();
  }

  if (!description) {
    description = `Course \"${title}\" in ${category} (${level}) with practical content and clear learning goals.`;
  }

  if (userId) {
    await pool.query(
      `INSERT INTO ai_logs (user_id, endpoint, input_data, output_data, mode)
       VALUES ($1, $2, $3::jsonb, $4, $5)`,
      [
        userId,
        "explain-course",
        JSON.stringify({ title, category, level }),
        description,
        openai ? "openai" : "fallback"
      ]
    );
  }

  return { description };
}

module.exports = {
  explainCourse
};
