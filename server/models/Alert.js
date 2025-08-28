const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    severity: { type: Number, default: 1 },
    timestamp: { type: Date, required: true },
  },
  { timestamps: true }
);

// 2dsphere index
AlertSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Alert", AlertSchema);
