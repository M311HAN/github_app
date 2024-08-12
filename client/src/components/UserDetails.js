import React, { useState, useEffect } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import RepoDetails from "./RepoDetails";

const UserDetails = () => {
  // Extract the username from the URL
  const { username } = useParams();
  // Hook to programmatically navigate
  const navigate = useNavigate();
  // State for storing user details
  const [user, setUser] = useState(null);
  // State for storing user repositories
  const [repos, setRepos] = useState([]);
  // Loading state for user details
  const [loadingUser, setLoadingUser] = useState(true);
  // Loading state for repositories
  const [loadingRepos, setLoadingRepos] = useState(true);
  // State for handling errors
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
    // Fetch user details from the API
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/users/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || `Request failed with status code ${res.status}`
          );
        }
        // Set user details
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Set error message
        setError(error.message);
      } finally {
        // Stop loading user details
        setLoadingUser(false);
      }
    };

    // Fetch user repositories from the API
    const fetchUserRepos = async () => {
      try {
        const res = await fetch(`/api/users/${username}/repos`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || `Request failed with status code ${res.status}`
          );
        }
        // Set user repositories
        setRepos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setError(error.message);
        setRepos([]);
      } finally {
        setLoadingRepos(false);
      }
    };

    // Reset states before fetching new data
    setError(null);
    setUser(null);
    setRepos([]);
    setLoadingUser(true);
    setLoadingRepos(true);

    // Fetch user details
    fetchUserDetails();
    // Fetch user repositories
    fetchUserRepos();
    // Re-run effect when the username changes
  }, [username]);

  // Show loading state while fetching data
  if (loadingUser || loadingRepos) {
    return (
      <div className="centered-message">
        <div className="loader"></div>
        <span className="loader-text">
          Loading user details and repositories...
        </span>
      </div>
    );
  }

  // Display error message if there is an error
  if (error) {
    return (
      <div className="centered-message">
        <p>Error: {error}</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Search
        </button>
      </div>
    );
  }

  // If user details are not found
  if (!user) {
    return <p className="centered-message">No user details found</p>;
  }

  return (
    <div className="container mt-4 mb-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate("/")}>
        Back to Search
      </button>
      <div className="card mb-4">
        <div className="card-body">
          <img
            src={user.avatar_url}
            alt={`Avatar of ${user.login}`}
            className="img-thumbnail mb-3"
          />
          <h1 className="card-title">{user.name}</h1>
          <p className="card-text">{user.bio}</p>
        </div>
      </div>

      <h2>Repositories</h2>
      <Routes>
        <Route
          path="/"
          element={
            <ul className="list-group">
              {repos.length > 0 ? (
                repos.map((repo) => (
                  <li
                    key={repo.id}
                    className="list-group-item list-group-item-action repo-item"
                    onClick={() => navigate(`repo/${repo.name}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {repo.name}
                  </li>
                ))
              ) : (
                <li className="list-group-item loading-text">
                  No repositories found
                </li>
              )}
            </ul>
          }
        />
        <Route
          path="repo/:repoName"
          element={<RepoDetails owner={username} />}
        />
      </Routes>
    </div>
  );
};

export default UserDetails;
