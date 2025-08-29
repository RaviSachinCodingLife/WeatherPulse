const express = require("express");
const router = express.Router();
const { onAlert } = require("../services/weatherService");
const Alert = require("../models/Alert");
const auth = require("../middleware/authMiddleware");

router.get("/stream", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 25_000);

  const sendAlert = (alert) => {
    try {
      res.write(`data: ${JSON.stringify(alert)}\n\n`);
    } catch (e) {
      console.log(e);
    }
  };

  onAlert(sendAlert);

  req.on("close", () => {
    clearInterval(heartbeat);
  });
});

router.get("/", auth, async (req, res) => {
  const items = await Alert.find().sort({ timestamp: -1 }).limit(200);
  res.json(items);
});

module.exports = router;
