import React from "react";
import { render } from "@testing-library/react";
// Import Router to handle routing within the test
import { BrowserRouter as Router } from "react-router-dom";
// Import the UserList component to be tested
import UserList from "../components/UserList";

// Sample user data to be passed as a prop to UserList
const users = [
  {
    id: 1,
    login: "octocat",
    avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
  },
  {
    id: 2,
    login: "user2",
    avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
  },
];

test("renders correctly", () => {
  // Render the UserList component within a Router, passing in the sample user data
  const { asFragment } = render(
    <Router>
      <UserList users={users} onSelectUser={() => {}} />
    </Router>
  );
  // Check that the rendered component matches the previous snapshot
  expect(asFragment()).toMatchSnapshot();
});
