require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const { connectRedis } = require("./infrastructure/redis/redisClient");

const app = express();

app.use(express.json());
app.use(cookieParser());

// ==========================
// HTTP LOGGING
// ==========================
app.use((req, res, next) => {
  logger.http({
    event: "HTTP_REQUEST",
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  next();
});

// ==========================
// ROUTERS
// ==========================
app.use("/api/cursos", require("./routers/course.router"));   
app.use("/api/cursos/auth", require("./routers/auth"));
app.use("/api/ai", require("./routers/ai"));

// ==========================
// ROOT
// ==========================
app.get("/", (req, res) => {
  res.send("API cursos");
});

// ==========================
// GLOBAL ERROR HANDLER (SIEMPRE AL FINAL)
// ==========================
app.use(errorHandler);

const puerto = process.env.PORT || 3000;

// ==========================
// START SERVER
// ==========================
if (require.main === module) {
  (async () => {
    await connectRedis();

    app.listen(puerto, () => {
      logger.info({
        event: "SERVER_STARTED",
        port: puerto
      });
    });
  })();
}

module.exports = app;