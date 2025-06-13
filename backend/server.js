const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Mobile Number Tracker API is running!");
});

// Live number tracking route (using numverify)
app.get("/track", async (req, res) => {
  const number = req.query.number;
  const accessKey = process.env.NUMVERIFY_API_KEY; // Set in .env or Render

  if (!number) {
    return res.status(400).json({ error: "Missing number query param" });
  }

  try {
    const response = await axios.get("http://apilayer.net/api/validate", {
      params: {
        access_key: accessKey,
        number: number,
      },
    });

    const data = response.data;

    if (!data.valid) {
      return res.status(404).json({ error: "Invalid phone number" });
    }

    res.json({
      number: data.international_format,
      country: data.country_name,
      location: data.location,
      carrier: data.carrier,
      line_type: data.line_type,
    });
  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).json({ error: "Failed to track number" });
  }
});

// Port config
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📡 Server running on port ${PORT}`);
});
