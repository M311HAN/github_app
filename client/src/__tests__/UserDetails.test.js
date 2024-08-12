import React from "react";
import { render } from "@testing-library/react";
// Import Router to handle routing within the test
import { BrowserRouter as Router } from "react-router-dom";
// Import the UserDetails component to be tested
import UserDetails from "../components/UserDetails";

test("renders correctly", () => {
  // Render the UserDetails component within a Router, passing in a sample username prop
  const { asFragment } = render(
    <Router>
      <UserDetails username="octocat" />
    </Router>
  );
  // Check that the rendered component matches the previous snapshot
  expect(asFragment()).toMatchSnapshot();
});
