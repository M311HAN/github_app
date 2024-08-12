// Import the 'path' module to handle file paths
const path = require("path");
// Load environment variables from the .env file
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  // Export the GitHub API URL from the environment variables
  GITHUB_API_URL: process.env.GITHUB_API_URL,
  // Export the port, with a default of 8080 if not set in the environment variables
  PORT: process.env.PORT || 8080,
};
