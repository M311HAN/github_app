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

describe("GET /api/users/:username", () => {
  // Describe the test suite for the GET /api/users/:username endpoint
  it("should return user details", async () => {
    // Define the test case for retrieving user details
    const response = await request(app).get("/api/users/octocat");
    // Perform a GET request to the user details endpoint with "octocat" as the username
    expect(response.statusCode).toBe(200);
    expect(response.body.login).toBe("octocat");
  });
});
