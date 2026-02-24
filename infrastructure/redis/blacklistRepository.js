const { redisClient } = require("./redisClient");

const isTest = process.env.NODE_ENV === "test";

// TTL = duración refresh token (7 días)
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

// ==========================
// ADD TO BLACKLIST
// ==========================
async function add(tokenHash) {
  if (isTest) return;

  try {
    await redisClient.set(`bl:${tokenHash}`, "1", {
      EX: REFRESH_TTL_SECONDS
    });
  } catch (err) {}
}

// ==========================
// CHECK BLACKLIST
// ==========================
async function has(tokenHash) {
  if (isTest) return false;

  try {
    const exists = await redisClient.get(`bl:${tokenHash}`);
    return !!exists;
  } catch (err) {
    return false;
  }
}

module.exports = {
  add,
  has
};