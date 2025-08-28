const axios = require("axios");
const EventEmitter = require("events");
const emitter = new EventEmitter();

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;

// USGS Earthquake live feed (past 1 hour)
const USGS_EARTHQUAKE_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

const seen = new Set();

// subscribe callback
function onAlert(cb) {
  emitter.on("alert", cb);
}

// fetch OpenWeather forecast
async function fetchOpenWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error(
      "Weather fetch failed:",
      err.response?.status,
      err.response?.data || err.message
    );
    throw err;
  }
}

// fetch earthquake data
async function fetchUSGSEarthquakes() {
  const res = await axios.get(USGS_EARTHQUAKE_URL);
  return res.data;
}

// detect severe weather alerts
function detectAndEmitFromOpenWeather(data, regionLabel, lat, lon) {
  if (data?.alerts && data.alerts.length) {
    data.alerts.forEach((a) => {
      const id = a.event + "|" + (a.start || "") + "|" + (a.end || "");
      if (seen.has(id)) return;
      seen.add(id);

      const alert = {
        id,
        type: "storm",
        title: a.event,
        description: a.description || a.sender_name,
        location: {
          type: "Point",
          coordinates: [lon, lat], // GeoJSON [lon, lat]
        },
        severity: a.severity || 3,
        timestamp: new Date().toISOString(),
      };

      emitter.emit("alert", alert);
    });
  }
}

// detect earthquakes
function detectAndEmitFromUSGS(geojson, magThreshold = 4.0) {
  for (const feat of geojson.features) {
    const id = feat.id;
    const mag = feat.properties.mag || 0;
    if (seen.has(id)) continue;
    if (mag >= magThreshold) {
      seen.add(id);

      const alert = {
        id,
        type: "earthquake",
        title: `M${mag} - ${feat.properties.place}`,
        description: feat.properties.title,
        location: {
          type: "Point",
          coordinates: [
            feat.geometry.coordinates[0], // longitude
            feat.geometry.coordinates[1], // latitude
          ],
        },
        severity: mag,
        timestamp: new Date(feat.properties.time).toISOString(),
      };

      emitter.emit("alert", alert);
    }
  }
}

// poll once (weather + earthquake)
async function pollOnce() {
  try {
    const watched = [
      { lat: 37.7749, lon: -122.4194, label: "San Francisco" },
      { lat: 35.6895, lon: 139.6917, label: "Tokyo" },
    ];

    for (const w of watched) {
      try {
        const data = await fetchOpenWeather(w.lat, w.lon);
        detectAndEmitFromOpenWeather(data, w.label, w.lat, w.lon);
      } catch (err) {
        console.error(
          `Weather fetch failed for ${w.label}:`,
          err.response?.status || err.message
        );
      }
    }

    const eq = await fetchUSGSEarthquakes();
    detectAndEmitFromUSGS(eq, 4.0);
  } catch (err) {
    console.error("poll err", err.message || err);
  }
}

// poll every X ms
let pollIntervalId = null;
function startPolling(intervalMs = 60_000) {
  if (pollIntervalId) return;
  pollOnce();
  pollIntervalId = setInterval(() => pollOnce(), intervalMs);
}
function stopPolling() {
  if (pollIntervalId) clearInterval(pollIntervalId);
  pollIntervalId = null;
}

module.exports = {
  onAlert,
  startPolling,
  stopPolling,
};
