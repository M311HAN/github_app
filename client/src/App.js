import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBox from "./components/SearchBox";
import UserList from "./components/UserList";
import UserDetails from "./components/UserDetails";

const App = () => {
  // State to store the list of users
  const [users, setUsers] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(false);
  // State to track if a search has been performed
  const [searchPerformed, setSearchPerformed] = useState(false);
  // State to store any errors
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset error when the component mounts or remounts
    setError(null);
  }, []);

  const handleSearch = async (username) => {
    if (!username.trim()) {
      // If the username is empty or just whitespace, show a specific error
      setError("Please enter a valid username.");
      return;
    }

    // Set loading state to true while fetching data
    setLoading(true);
    // Indicate that a search has been performed
    setSearchPerformed(true);
    // Clear any previous errors before making a new request
    setError(null);

    try {
      const response = await fetch(`/api/search/users?q=${username}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();
      // Update the users state with the fetched data
      setUsers(data.items);
    } catch (err) {
      // Set a generic error message in case of an error
      setError("An error occurred while fetching data.");
    } finally {
      // Set loading state to false after the data is fetched or an error occurs
      setLoading(false);
    }
  };

  return (
    <Router>
      <div>
        <SearchBox onSearch={handleSearch} />
        {error && (
          <div className="error-container">
            <p className="error-text">Error: {error}</p>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <p className="loading-text">Loading...</p>
              ) : (
                searchPerformed && <UserList users={users} />
              )
            }
          />
          <Route path="/users/:username/*" element={<UserDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
