import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Test to ensure the search button renders correctly
test("renders search button", () => {
  // Render the App component
  render(<App />);
  // Find the search button element by its text
  const searchButton = screen.getByText(/search/i);
  // Assert that the search button is in the document
  expect(searchButton).toBeInTheDocument();
});
