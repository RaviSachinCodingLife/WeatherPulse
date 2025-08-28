const axios = require("axios");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const sns = new SNSClient({ region: process.env.AWS_REGION });
const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;
const USGS_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

async function fetchOpenWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}`;
  const r = await axios.get(url);
  return r.data;
}
async function fetchUSGS() {
  const r = await axios.get(USGS_URL);
  return r.data;
}

exports.handler = async function (event) {
  // pick a few global points or load from config / SSM
  const watched = [
    { lat: 37.7749, lon: -122.4194, label: "SF" },
    { lat: 35.6895, lon: 139.6917, label: "Tokyo" },
  ];

  const alerts = [];

  for (const w of watched) {
    try {
      const data = await fetchOpenWeather(w.lat, w.lon);
      if (data.alerts && data.alerts.length) {
        for (const a of data.alerts) {
          alerts.push({
            source: "openweather",
            event: a.event,
            sender: a.sender_name,
            description: a.description,
            region: w.label,
            start: a.start,
            end: a.end,
            lat: w.lat,
            lon: w.lon,
          });
        }
      }
    } catch (e) {
      console.error("ow err", e.message);
    }
  }

  try {
    const eq = await fetchUSGS();
    for (const feat of eq.features) {
      const mag = feat.properties.mag || 0;
      if (mag >= 4.0) {
        alerts.push({
          source: "usgs",
          event: feat.properties.title,
          magnitude: mag,
          coords: feat.geometry.coordinates,
        });
      }
    }
  } catch (e) {
    console.error("usgs err", e.message);
  }

  // publish to SNS once (or per-alert)
  if (alerts.length > 0) {
    const cmd = new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Subject: `WeatherPulse: ${alerts.length} new events`,
      Message: JSON.stringify({ events: alerts }, null, 2),
    });
    await sns.send(cmd);
  }

  return { status: "done", found: alerts.length };
};
