const { redisClient } = require("./redisClient");

const isTest = process.env.NODE_ENV === "test";

// ==========================
// GET
// ==========================
async function get(key) {
  if (isTest) return null;

  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
}

// ==========================
// SET
// ==========================
async function set(key, value, ttl = 60) {
  if (isTest) return;

  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl
    });
  } catch (err) {}
}

// ==========================
// DEL KEY
// ==========================
async function del(key) {
  if (isTest) return;

  try {
    await redisClient.del(key);
  } catch (err) {}
}

// ==========================
// DEL BY PATTERN 
// ==========================
async function delByPattern(pattern) {
  if (isTest) return;

  try {
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {}
}

module.exports = {
  get,
  set,
  del,
  delByPattern
};