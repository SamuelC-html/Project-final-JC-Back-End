const express = require("express");
const Review = require("../models/Review");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

// Crear review
router.post("/", verifyToken, async (req, res) => {
  try {
    const { gameTitle, comment, rating } = req.body;

    if (!gameTitle || !comment || !rating) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const review = new Review({
      userId: req.user.id,
      username: req.user.username,
      avatar: req.user.avatar || null,
      gameTitle,
      comment,
      rating
    });

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener reviews públicas
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
