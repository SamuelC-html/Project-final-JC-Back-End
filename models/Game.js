const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  plataforma: { type: String },
  completado: { type: Boolean, default: false },
  horasJugadas: { type: Number, default: 0 },
  calificacion: { type: Number, min: 0, max: 5 },
  imagen: { type: String },
});

module.exports = mongoose.model("Game", gameSchema);