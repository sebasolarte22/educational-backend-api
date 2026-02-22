const { redisClient } = require("./redisClient");

// ==========================
// GET
// ==========================
async function get(key) {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
}

// ==========================
// SET
// ==========================
async function set(key, value, ttl = 60) {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttl
  });
}

// ==========================
// DEL KEY
// ==========================
async function del(key) {
  await redisClient.del(key);
}

// ==========================
// DEL BY PATTERN ⭐ IMPORTANTE
// ==========================
async function delByPattern(pattern) {
  const keys = await redisClient.keys(pattern);

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}

module.exports = {
  get,
  set,
  del,
  delByPattern
};