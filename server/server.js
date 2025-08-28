// server/server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const weatherService = require("./services/weatherService");
const snsService = require("./services/snsService");
const Alert = require("./models/Alert");

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB (no deprecated options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error("Mongo err", err));

// example route: get history
app.get("/api/alerts", async (req, res) => {
  const items = await Alert.find().sort({ timestamp: -1 }).limit(200);
  res.json(items);
});

// subscription route (subscribe email/phone to SNS topic)
app.post("/api/subscribe", async (req, res) => {
  const { protocol, endpoint } = req.body;
  try {
    const resp = await snsService.subscribe(
      process.env.SNS_TOPIC_ARN,
      protocol,
      endpoint
    );
    res.json(resp);
  } catch (err) {
    console.error("subscribe err:", err);
    res.status(500).json({ error: "subscribe failed", details: String(err) });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
});

function broadcastAlert(alert) {
  io.emit("weather-alert", alert);
}

// When a new alert is detected: upsert into DB, publish to SNS (if configured), broadcast
weatherService.onAlert(async (alert) => {
  try {
    // Use upsert to avoid duplicate-key crash
    await Alert.updateOne({ id: alert.id }, { $set: alert }, { upsert: true });

    // publish to SNS if ARN provided
    if (process.env.SNS_TOPIC_ARN) {
      try {
        await snsService.publishAlert(alert);
      } catch (e) {
        console.error("sns pub err", e);
      }
    } else {
      console.log("SNS_TOPIC_ARN not set — skipping SNS publish");
    }

    // broadcast to connected websocket clients
    broadcastAlert(alert);
  } catch (dbErr) {
    console.error("db save/upsert err", dbErr);
  }
});

// start periodic polling inside weatherService
weatherService.startPolling();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log("Server listening", PORT));
