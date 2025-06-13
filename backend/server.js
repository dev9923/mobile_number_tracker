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
