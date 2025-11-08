// =======================
// 🎮 BACKEND BIBLIOTECA DE VIDEOJUEGOS
// =======================

// Importar dependencias
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

console.log("=> Iniciando servidor de videojuegos...");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// =======================
// 🔗 Conexión a MongoDB
// =======================
const URL_DB = "mongodb+srv://jacobogarcesoquendo:aFJzVMGN3o7fA38A@cluster0.mqwbn.mongodb.net/samueldavidcanoguzman?retryWrites=true&w=majority";

mongoose
  .connect(URL_DB)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar con MongoDB:", err.message));

// =======================
// 🧩 MODELO DE DATOS (Game)
// =======================
// Define la estructura de cada videojuego dentro de la colección "games"
const gameSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  genero: { type: String },
  plataforma: { type: String },
  imagen: { type: String }, // URL o base64 de la portada del juego
});

const Game = mongoose.model("Game", gameSchema);

// =======================
// 📦 ENDPOINTS CRUD
// =======================

// ✅ Crear un nuevo juego
app.post("/games", async (req, res) => {
  try {
    const { titulo, descripcion, genero, plataforma, imagen } = req.body;

    if (!titulo) {
      return res.status(400).json({ error: "El campo 'titulo' es obligatorio" });
    }

    const newGame = new Game({
      titulo,
      descripcion,
      genero,
      plataforma,
      imagen,
    });

    await newGame.save();
    res.status(201).json({ message: "🎮 Juego agregado exitosamente", data: newGame });
  } catch (error) {
    console.error("❌ Error al crear juego:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 📖 Obtener todos los juegos
app.get("/games", async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    console.error("❌ Error al obtener juegos:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✏️ Actualizar un juego por ID
app.put("/games/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedGame = await Game.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedGame) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }

    res.json({ message: "🛠️ Juego actualizado correctamente", data: updatedGame });
  } catch (error) {
    console.error("❌ Error al actualizar juego:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 🗑️ Eliminar un juego por ID
app.delete("/games/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }

    res.json({ message: "🗑️ Juego eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar juego:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// 🚀 INICIAR SERVIDOR
// =======================
app.listen(port, () => {
  console.log(`✅ Servidor de videojuegos corriendo en http://localhost:${port}`);
});
