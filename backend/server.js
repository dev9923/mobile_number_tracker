const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let userLocations = {};

app.post('/update-location', (req, res) => {
  const { phone, lat, lng } = req.body;
  userLocations[phone] = { lat, lng, timestamp: new Date() };
  res.send({ status: 'Location updated' });
});

app.get('/get-location/:phone', (req, res) => {
  const phone = req.params.phone;
  res.send(userLocations[phone] || {});
});

app.listen(port, () => console.log(`Server running on port ${port}`));
const express = require("express");
const axios = require("axios");

// Optional: add CORS support
const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Mobile Number Tracker API is running!");
});

// ➕ Add this /track route
app.get("/track", async (req, res) => {
  const number = req.query.number;

  if (!number) {
    return res.status(400).json({ error: "Missing number query param" });
  }

  // ✅ Dummy data (replace with real API call later)
  res.json({
    number: number,
    country: "India",
    location: "Delhi",
    carrier: "Airtel",
    line_type: "Mobile",
  });
});

// 🔊 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
