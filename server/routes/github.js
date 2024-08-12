const express = require("express");
const axios = require("axios");
const { body, param, query, validationResult } = require("express-validator");
const router = express.Router();

const GITHUB_API_URL = process.env.GITHUB_API_URL;

// Utility function for making GitHub API requests
const makeGithubApiRequest = async (url, res) => {
  try {
    const response = await axios.get(url);
    // Return the data from GitHub API in the response
    return res.json(response.data);
  } catch (error) {
    // Handle any errors that occur during the API request
    handleApiError(error, res);
  }
};

// Centralized error handling function
const handleApiError = (error, res) => {
  if (error.response && error.response.status === 403) {
    // Handle GitHub API rate limit errors
    return res.status(403).json({
      error: "GitHub API rate limit exceeded. Please try again later.",
    });
  } else if (error.response && error.response.status === 404) {
    // Handle "not found" errors
    return res.status(404).json({
      error: "Resource not found. Please check the provided details.",
    });
  } else {
    // Handle all other errors
    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

// Middleware for validating input
const validate = (checks) => [
  ...checks,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors to the client
      return res.status(400).json({ errors: errors.array() });
    }
    // Proceed to the next middleware/handler if validation passes
    next();
  },
];

// Search users by username with validation
router.get(
  "/search/users",
  validate([
    query("q")
      .isString()
      .withMessage("Query must be a string")
      .notEmpty()
      .withMessage("Query cannot be empty"),
  ]),
  (req, res) => {
    const { q } = req.query;
    const url = `${GITHUB_API_URL}/search/users?q=${q}`;
    // Make the API request and handle the response
    makeGithubApiRequest(url, res);
  }
);

// Get user details by username with validation
router.get(
  "/users/:username",
  validate([
    param("username")
      .isString()
      .withMessage("Username must be a string")
      .notEmpty()
      .withMessage("Username cannot be empty"),
  ]),
  (req, res) => {
    const { username } = req.params;
    const url = `${GITHUB_API_URL}/users/${username}`;
    makeGithubApiRequest(url, res);
  }
);

// Get user repositories by username with validation
router.get(
  "/users/:username/repos",
  validate([
    param("username")
      .isString()
      .withMessage("Username must be a string")
      .notEmpty()
      .withMessage("Username cannot be empty"),
  ]),
  (req, res) => {
    const { username } = req.params;
    const url = `${GITHUB_API_URL}/users/${username}/repos`;
    // Make the API request and handle the response
    makeGithubApiRequest(url, res);
  }
);

// Get repository commits by owner and repo name with validation
router.get(
  "/repos/:owner/:repo/commits",
  validate([
    param("owner")
      .isString()
      .withMessage("Owner must be a string")
      .notEmpty()
      .withMessage("Owner cannot be empty"),
    param("repo")
      .isString()
      .withMessage("Repo name must be a string")
      .notEmpty()
      .withMessage("Repo name cannot be empty"),
  ]),
  (req, res) => {
    const { owner, repo } = req.params;
    const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/commits`;
    makeGithubApiRequest(url, res);
  }
);
// Export the router to be used in other parts of the application
module.exports = router;
