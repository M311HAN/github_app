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

describe("GET /api/repos/:owner/:repo/commits", () => {
  // Describe the test suite for the GET /api/repos/:owner/:repo/commits endpoint
  it("should return repository commits", async () => {
    // Define the test case for retrieving repository commits
    const response = await request(app).get(
      "/api/repos/octocat/hello-world/commits"
    );
    // Perform a GET request to the repository commits endpoint for the "octocat/hello-world" repository
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
