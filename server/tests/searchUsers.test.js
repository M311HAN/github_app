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

describe("GET /api/search/users", () => {
  // Describe the test suite for the GET /api/search/users endpoint
  it("should return search results for users", async () => {
    // Define the test case
    const response = await request(app).get("/api/search/users?q=octocat");
    // Perform a GET request to the search users endpoint with "octocat" as the query
    // Assert that the response status code is 200
    // Assert that the response body contains an array of items
    expect(response.statusCode).toBe(200);
    expect(response.body.items).toBeInstanceOf(Array);
  });
});
