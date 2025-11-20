// =======================
// 🎮 BACKEND SCSXStudio
// =======================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const gameRoutes = require("./routes/gameRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();

console.log("=> Iniciando servidor SCSXStudio...");

const app = express();
const port = 3000;

// Middleware global
app.use(express.json());
app.use(cors());

// =======================
// 🔗 Conexión a MongoDB
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar:", err.message));

// =======================
// 📦 Rutas principales
// =======================
app.use("/api/games", gameRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

// =======================
// 🚀 Iniciar servidor
// =======================
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});