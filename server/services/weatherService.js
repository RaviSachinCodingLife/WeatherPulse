const axios = require("axios");
const EventEmitter = require("events");
const emitter = new EventEmitter();
const { v4: uuidv4 } = require("uuid");

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;
const USGS_EARTHQUAKE_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

if (!OPENWEATHER_KEY) {
  console.warn(
    "Warning: OPENWEATHER_API_KEY not set. Forecast requests will fail."
  );
}

// India bounding box
const INDIA_BOUNDS = { minLat: 6.5, maxLat: 37.1, minLon: 68.7, maxLon: 97.25 };
function isInsideIndia(lat, lon) {
  return (
    lat >= INDIA_BOUNDS.minLat &&
    lat <= INDIA_BOUNDS.maxLat &&
    lon >= INDIA_BOUNDS.minLon &&
    lon <= INDIA_BOUNDS.maxLon
  );
}

// Duplicate tracking
const seen = new Set();

// Thresholds
const RAIN_THRESHOLD_MM = parseFloat(process.env.ALERT_RAIN_THRESHOLD_MM) || 50;
const WIND_THRESHOLD_MS = parseFloat(process.env.ALERT_WIND_THRESHOLD_MS) || 15;
const MAG_THRESHOLD = parseFloat(process.env.EQ_MAG_THRESHOLD) || 4.0;
const DROUGHT_THRESHOLD_MM =
  parseFloat(process.env.ALERT_DROUGHT_THRESHOLD_MM) || 2;

// Subscribe to alerts
const ALERT_TYPES = ["storm", "flood", "drought", "earthquake"];

function onAlert(cb) {
  emitter.on("alert", cb);
}
// Fetch forecast
async function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`;
  const res = await axios.get(url, { timeout: 15000 });
  return res.data;
}

// Helper to create alert
function createAndEmitAlert({
  type,
  title,
  description,
  lat,
  lon,
  severity,
  idSuffix,
}) {
  const id = `${type}|${idSuffix}`;
  if (seen.has(id)) return;
  seen.add(id);

  const alert = {
    id,
    type,
    title,
    description,
    location: { type: "Point", coordinates: [lon, lat] },
    severity: severity || 1,
    timestamp: new Date().toISOString(),
  };

  emitter.emit("alert", alert);
}

// Drought alert
function detectDroughtAlert(data, regionLabel, lat, lon) {
  const last3Days = data.list.slice(0, 24 * 3); // approx 3 days
  if (
    last3Days.every((item) => (item.rain?.["3h"] || 0) <= DROUGHT_THRESHOLD_MM)
  ) {
    createAndEmitAlert({
      type: "drought",
      title: `Drought alert — ${regionLabel}`,
      description: `Low rainfall forecasted`,
      lat,
      lon,
      severity: 4,
      idSuffix: `drought|${lat.toFixed(2)}|${lon.toFixed(2)}`,
    });
  }
}

// Detect forecast alerts
function detectAndEmitFromForecast(data, regionLabel, lat, lon) {
  if (!data || !Array.isArray(data.list)) return;

  for (const item of data.list) {
    const dt = item.dt;
    const timeISO = new Date(dt * 1000).toISOString();
    const weather = (item.weather && item.weather[0]) || {};
    const wind = item.wind || {};
    const rain3h = (item.rain && (item.rain["3h"] || item.rain["1h"])) || 0;
    const snow3h = (item.snow && (item.snow["3h"] || item.snow["1h"])) || 0;

    // Heavy rain
    if (rain3h >= RAIN_THRESHOLD_MM) {
      createAndEmitAlert({
        type: "heavy_rain",
        title: `Heavy rain — ${regionLabel}`,
        description: `${rain3h} mm rain at ${timeISO}`,
        lat,
        lon,
        severity: Math.min(5, Math.round(rain3h / 10)),
        idSuffix: `rain|${dt}|${lat.toFixed(2)}|${lon.toFixed(2)}`,
      });
    }

    // High wind
    if (wind.speed >= WIND_THRESHOLD_MS) {
      createAndEmitAlert({
        type: "high_wind",
        title: `High winds — ${regionLabel}`,
        description: `${wind.speed} m/s at ${timeISO}`,
        lat,
        lon,
        severity: Math.min(5, Math.round(wind.speed / 3)),
        idSuffix: `wind|${dt}|${lat.toFixed(2)}|${lon.toFixed(2)}`,
      });
    }

    // Thunderstorm
    if (
      weather.main === "Thunderstorm" ||
      (weather.id >= 200 && weather.id < 300)
    ) {
      createAndEmitAlert({
        type: "thunderstorm",
        title: `Thunderstorm — ${regionLabel}`,
        description: weather.description || "Thunderstorm",
        lat,
        lon,
        severity: 4,
        idSuffix: `storm|${dt}|${lat.toFixed(2)}|${lon.toFixed(2)}`,
      });
    }

    // Snow
    if (snow3h >= 20) {
      createAndEmitAlert({
        type: "heavy_snow",
        title: `Heavy snow — ${regionLabel}`,
        description: `${snow3h} mm snow`,
        lat,
        lon,
        severity: 4,
        idSuffix: `snow|${dt}|${lat.toFixed(2)}|${lon.toFixed(2)}`,
      });
    }
  }

  // Drought check
  detectDroughtAlert(data, regionLabel, lat, lon);
}

// Fetch earthquakes
async function fetchUSGSEarthquakes() {
  const res = await axios.get(USGS_EARTHQUAKE_URL, { timeout: 15000 });
  return res.data;
}

// Detect earthquakes
function detectAndEmitFromUSGS(geojson, magThreshold = MAG_THRESHOLD) {
  if (!geojson || !Array.isArray(geojson.features)) return;
  for (const feat of geojson.features) {
    const id = feat.id;
    const props = feat.properties || {};
    const coords = feat.geometry?.coordinates || [];
    const [lon, lat] = coords;
    const mag = props.mag || 0;

    if (!isFinite(lat) || !isFinite(lon)) continue;
    if (seen.has(id)) continue;

    if (mag >= magThreshold && isInsideIndia(lat, lon)) {
      seen.add(id);
      createAndEmitAlert({
        type: "earthquake",
        title: `M${mag} — ${props.place || "unknown"}`,
        description: props.title || "USGS earthquake",
        lat,
        lon,
        severity: mag,
        idSuffix: id,
      });
    }
  }
}

const latestAlerts = [];

// Polling locations
const INDIA_STATES = [
  { label: "Andhra Pradesh", lat: 15.9129, lon: 79.74 },
  { label: "Arunachal Pradesh", lat: 28.218, lon: 94.7278 },
  { label: "Assam", lat: 26.2006, lon: 92.9376 },
  { label: "Bihar", lat: 25.0961, lon: 85.3131 },
  { label: "Chhattisgarh", lat: 21.2787, lon: 81.8661 },
  { label: "Goa", lat: 15.4909, lon: 73.8278 },
  { label: "Gujarat", lat: 22.2587, lon: 71.1924 },
  { label: "Haryana", lat: 29.0588, lon: 76.0856 },
  { label: "Himachal Pradesh", lat: 31.1048, lon: 77.1734 },
  { label: "Jharkhand", lat: 23.6102, lon: 85.2799 },
  { label: "Karnataka", lat: 15.3173, lon: 75.7139 },
  { label: "Kerala", lat: 10.8505, lon: 76.2711 },
  { label: "Madhya Pradesh", lat: 22.9734, lon: 78.6569 },
  { label: "Maharashtra", lat: 19.7515, lon: 75.7139 },
  { label: "Manipur", lat: 24.6637, lon: 93.9063 },
  { label: "Meghalaya", lat: 25.467, lon: 91.3662 },
  { label: "Mizoram", lat: 23.1645, lon: 92.9376 },
  { label: "Nagaland", lat: 26.1584, lon: 94.5624 },
  { label: "Odisha", lat: 20.9517, lon: 85.0985 },
  { label: "Punjab", lat: 31.1471, lon: 75.3412 },
  { label: "Rajasthan", lat: 27.0238, lon: 74.2179 },
  { label: "Sikkim", lat: 27.533, lon: 88.5122 },
  { label: "Tamil Nadu", lat: 11.1271, lon: 78.6569 },
  { label: "Telangana", lat: 18.1124, lon: 79.0193 },
  { label: "Tripura", lat: 23.9408, lon: 91.9882 },
  { label: "Uttar Pradesh", lat: 26.8467, lon: 80.9462 },
  { label: "Uttarakhand", lat: 30.0668, lon: 79.0193 },
  { label: "West Bengal", lat: 22.9868, lon: 87.855 },
];

// Emit alert (always unique)
function emitAlert({ type, title, description, lat, lon, severity }) {
  const id = uuidv4();
  const alert = {
    id,
    type,
    title,
    description,
    coords: [lat, lon],
    severity,
    timestamp: new Date().toISOString(),
  };
  emitter.emit("alert", alert);
}

// Poll once
async function pollOnce() {
  try {
    for (const w of watched) {
      try {
        const data = await fetchForecast(w.lat, w.lon);
        detectAndEmitFromForecast(data, w.label, w.lat, w.lon);
      } catch (err) {
        console.error(`Weather fetch failed for ${w.label}:`, err.message);
      }
    }

    const eq = await fetchUSGSEarthquakes();
    detectAndEmitFromUSGS(eq, MAG_THRESHOLD);
  } catch (err) {
    console.error("poll err", err.message);
  }
}

// Emit random alert for demo
function pollAlerts() {
  INDIA_STATES.forEach((s) => {
    const type = ALERT_TYPES[Math.floor(Math.random() * ALERT_TYPES.length)];
    const severity = Math.floor(Math.random() * 5) + 1;
    emitAlert({
      type,
      title: `${type.toUpperCase()} alert — ${s.label}`,
      description: `This is a ${type} alert for ${s.label}`,
      lat: s.lat,
      lon: s.lon,
      severity,
    });
  });
}
let intervalId = null;
function startPolling(intervalMs = 10000) {
  if (intervalId) return;
  pollAlerts(); // show all state alerts immediately on refresh
  intervalId = setInterval(pollAlerts, intervalMs);
  console.log("WeatherService polling started");
}

function stopPolling() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
}

module.exports = { onAlert, startPolling, stopPolling };
