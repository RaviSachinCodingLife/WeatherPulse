const express = require("express");
const router = express.Router();
const { onAlert } = require("../services/weatherService");

router.get("/stream", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendAlert = (alert) => res.write(`data: ${JSON.stringify(alert)}\n\n`);
  onAlert(sendAlert);

  req.on("close", () => console.log("Client disconnected"));
});

module.exports = router;
