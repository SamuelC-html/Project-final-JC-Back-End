const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const CommentSchema = new mongoose.Schema({
  shortId: {
    type: String,
    default: () => nanoid(10),
    unique: true,
  },

  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    required: true,
  },

  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  text: { type: String, default: "" },

  // Votos reddit
  score: { type: Number, default: 0 },
  votes: {
    type: Map,
    of: Number,
    default: {},
  },

  // ESTADO
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },

  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date, default: null },

  replyCount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
