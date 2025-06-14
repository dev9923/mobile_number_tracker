require('dotenv').config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files from the "frontend" folder
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ API: Track number using Numverify
app.post("/api/track", async (req, res) => {
  const { phone } = req.body;
  const accessKey = process.env.NUMVERIFY_API_KEY;

  if (!phone) {
    return res.status(400).json({ error: "Missing phone number" });
  }

  try {
    // 1. Get number info from Numverify
    const verifyRes = await axios.get("http://apilayer.net/api/validate", {
      params: {
        access_key: accessKey,
        number: phone
      }
    });

    const data = verifyRes.data;
    if (!data.valid) {
      return res.status(404).json({ error: "Invalid phone number" });
    }

    // 2. Optional: Use location name to get coordinates (OpenCage or similar)
    let coords = null;
    if (data.location) {
      try {
        const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: `${data.location}, ${data.country_name}`,
            format: "json",
            limit: 1
          },
          headers: { "User-Agent": "Mobile-Tracker-App" }
        });

        if (geoRes.data.length > 0) {
          coords = {
            lat: parseFloat(geoRes.data[0].lat),
            lng: parseFloat(geoRes.data[0].lon)
          };
        }
      } catch (geoErr) {
        console.warn("Geolocation lookup failed:", geoErr.message);
      }
    }

    res.json({
      country_name: data.country_name,
      location: data.location,
      carrier: data.carrier,
      line_type: data.line_type,
      coordinates: coords
    });

  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).json({ error: "Failed to track number" });
  }
});

// ✅ Fallback: Serve frontend app for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📡 Server running on port ${PORT}`);
});
