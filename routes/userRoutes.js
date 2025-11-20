// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// ---------------------
// REGISTER
// ---------------------
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashed
    });

    await newUser.save();

    return res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error en /register:", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
});

// ---------------------
// LOGIN
// ---------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // 🔥 Token ahora SI trae username y avatar
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        avatar: user.avatar || null
      },
      JWT_SECRET,
      { expiresIn: "6h" }
    );

    return res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error("Error en /login:", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
});

// ---------------------
// PROFILE
// ---------------------
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    return res.json(user);
  } catch (err) {
    console.error("Error en /profile:", err);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
});

// ---------------------
// VERIFY
// ---------------------
router.get("/verify", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ valid: false });

    jwt.verify(token, JWT_SECRET);
    return res.json({ valid: true });
  } catch {
    return res.json({ valid: false });
  }
});

module.exports = router;
