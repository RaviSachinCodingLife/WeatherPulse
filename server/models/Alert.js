const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: String,
  title: String,
  description: String,
  coords: [Number],
  severity: Number,
  timestamp: Date,
});

module.exports = mongoose.model("Alert", alertSchema);
