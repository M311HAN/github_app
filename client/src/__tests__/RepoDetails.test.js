import React from "react";
import { render } from "@testing-library/react";
// Import Router
import { BrowserRouter as Router } from "react-router-dom";
// Import the RepoDetails component to be tested
import RepoDetails from "../components/RepoDetails";

test("renders correctly", () => {
  // Render the RepoDetails component wrapped in a Router to handle routing-related functionality
  const { asFragment } = render(
    <Router>
      <RepoDetails owner="octocat" repo="hello-world" />
    </Router>
  );
  // Check that the rendered component matches the previous snapshot
  expect(asFragment()).toMatchSnapshot();
});
