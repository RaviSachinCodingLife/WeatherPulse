require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const weatherService = require("./services/weatherService");
const snsService = require("./services/snsService");
const Alert = require("./models/Alert");
const alertRouter = require("./routes/alerts");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/alerts", alertRouter);

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error("Mongo err", err));

// history route
app.get("/api/alerts", async (req, res) => {
  const items = await Alert.find().sort({ timestamp: -1 }).limit(200);
  res.json(items);
});

// subscription route (email/phone to SNS)
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

app.get("/api/weather", async (req, res) => {
  const { city, lat, lon } = req.query;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({ error: "city or lat/lon is required" });
  }

  try {
    const axios = require("axios");
    let url = "";

    if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    }

    const resp = await axios.get(url);
    const data = resp.data;

    res.json({
      temp: data.list[0].main.temp,
      description: data.list[0].weather[0].description,
      city: data.city.name,
      hourly: data.list.slice(0, 5),
      daily: data.list.filter((_, i) => i % 8 === 0).slice(0, 5),
    });
  } catch (err) {
    console.error(
      "Backend weather fetch failed:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "weather fetch failed" });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
});

// broadcast helper
function broadcastAlert(alert) {
  io.emit("weather-alert", alert);
}

// listen for alerts from weatherService
// weatherService.onAlert(async (alert) => {
//   try {
//     // save / update in DB
//     await Alert.updateOne({ id: alert.id }, { $set: alert }, { upsert: true });

//     // publish to SNS
//     if (process.env.SNS_TOPIC_ARN) {
//       try {
//         await snsService.publishAlert(alert);
//       } catch (e) {
//         console.error("sns pub err", e);
//       }
//     } else {
//       console.log("SNS_TOPIC_ARN not set — skipping SNS publish");
//     }

//     // broadcast to WS clients
//     broadcastAlert(alert);
//   } catch (dbErr) {
//     console.error("db save/upsert err", dbErr);
//   }
// });

// start polling weather + earthquakes
weatherService.onAlert((alert) => io.emit("weather-alert", alert));
weatherService.startPolling();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log("Server listening", PORT));
