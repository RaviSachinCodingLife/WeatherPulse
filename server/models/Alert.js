const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  type: String,
  severity: Number,
  timestamp: { type: Date, default: Date.now },
  // ✅ GeoJSON
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: "2dsphere",
      required: true,
    },
  },
});

module.exports = mongoose.model("Alert", alertSchema);
