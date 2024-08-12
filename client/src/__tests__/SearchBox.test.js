import React from "react";
import { render } from "@testing-library/react";
// Import the SearchBox component to be tested
import SearchBox from "../components/SearchBox";

test("renders correctly", () => {
  // Render the SearchBox component with a dummy onSearch prop
  const { asFragment } = render(<SearchBox onSearch={() => {}} />);
  // Check that the rendered component matches the previous snapshot
  expect(asFragment()).toMatchSnapshot();
});
