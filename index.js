const express = require('express');
const path = require('path');

const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving JSON workout data (can be more dynamic)
app.get('/workout-data', (req, res) => {
  const week = req.query.week;
  const day = req.query.day;

  // Load the JSON data for the workout program dynamically
  const workoutData = require(`./data/week${week}-day${day}.json`);
  res.json(workoutData);
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});