require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Logging profesional de requests
app.use((req, res, next) => {
  logger.http({
    event: "HTTP_REQUEST",
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  next();
});

// Routers
app.use("/api/cursos/programacion", require("./routers/programacion"));
app.use("/api/cursos/matematicas", require("./routers/matematicas"));
app.use("/api/cursos/auth", require("./routers/auth"));
app.use("/api/ai", require("./routers/ai"));
app.use("/api/users", require("./routers/users"));

// Root
app.get("/", (req, res) => {
  res.send("API cursos");
});

// 🔥 Middleware global de errores (SIEMPRE AL FINAL)
app.use(errorHandler);

const puerto = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(puerto, () => {
    logger.info({
      event: "SERVER_STARTED",
      port: puerto
    });
  });
}

module.exports = app;
