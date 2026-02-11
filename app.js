require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware global
app.use(express.json());
app.use(cookieParser());

// Routers
app.use("/api/cursos/programacion", require("./routers/programacion"));
app.use("/api/cursos/matematicas", require("./routers/matematicas"));
app.use("/api/cursos/auth", require("./routers/auth"));
app.use("/api/ai", require("./routers/ai"));



// Root
app.get("/", (req, res) => {
  res.send("API cursos");
});

const puerto = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(puerto, () => {
    console.log(`Se esta escuchando el puerto ${puerto}`);
  });
}

module.exports = app;


