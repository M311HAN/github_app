// Load environment variables from config.js
require("./config/config");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const githubRoutes = require("./routes/github");

const app = express();
const port = process.env.PORT || 8080;

// Middleware setup
// Adds security-related HTTP headers to protect against common vulnerabilities
app.use(helmet());
// Enables Cross-Origin Resource Sharing, allowing the API to be accessed from different origins
app.use(cors());
// Automatically parses JSON request bodies into JavaScript objects
app.use(express.json());
// Logs HTTP requests to the console in a concise format for easier debugging and monitoring
app.use(morgan("tiny"));

// API Routes
app.use("/api", githubRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
