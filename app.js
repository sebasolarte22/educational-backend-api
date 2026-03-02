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
app.use("/api/courses", require("./routers/course.router"));   
app.use("/api/courses/auth", require("./routers/auth.router"));
app.use("/api/ai", require("./routers/ai.router"));
app.use("/api/favorites", require("./routers/fav.router"));
app.use("/api/progress", require("./routers/progress.router"));
app.use("/api/enrollment", require("./routers/enrollment.router"));
app.use("/api/sections", require("./routers/section.router"));
app.use("/api/lessons", require("./routers/lesson.router"));

// ==========================
// ROOT
// ==========================
app.get("/", (req, res) => {
  res.send("API COURSES");
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