// Load environment variables from the config file
require("../config/config");

// Import supertest for testing HTTP requests
const request = require("supertest");
// Import express to create the server
const express = require("express");
// Import GitHub routes to be tested
const githubRoutes = require("../routes/github");

const app = express();
app.use("/api", githubRoutes);

describe("GET /api/users/:username/repos", () => {
  // Describe the test suite for the GET /api/users/:username/repos endpoint
  it("should return user repositories", async () => {
    // Define the test case for retrieving user repositories
    const response = await request(app).get("/api/users/octocat/repos");
    // Perform a GET request to the user repositories endpoint with "octocat" as the username
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
