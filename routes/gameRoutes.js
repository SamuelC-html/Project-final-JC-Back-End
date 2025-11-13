const express = require("express");
const Game = require("../models/Game");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Crear juego
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newGame = new Game({ ...req.body, userId: req.user.id });
    const saved = await newGame.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📖 Obtener juegos del usuario actual
router.get("/", authMiddleware, async (req, res) => {
  try {
    const games = await Game.find({ userId: req.user.id });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✏️ Actualizar un juego
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Game.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Juego no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🗑️ Eliminar un juego
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Game.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Juego no encontrado" });
    res.json({ message: "Juego eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;