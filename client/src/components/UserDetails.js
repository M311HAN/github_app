import React, { useState, useEffect } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import RepoDetails from "./RepoDetails";

// Component to display user details and their repositories
const UserDetails = () => {
  // Extract the username from the URL parameters
  const { username } = useParams();
  // Hook to navigate programmatically
  const navigate = useNavigate();
  // State to store user details
  const [user, setUser] = useState(null);
  // State to store user repositories
  const [repos, setRepos] = useState([]);
  // State to manage loading status for user details
  const [loadingUser, setLoadingUser] = useState(true);
  // State to manage loading status for repositories
  const [loadingRepos, setLoadingRepos] = useState(true);
  // State to manage error messages
  const [error, setError] = useState(null);

  // Effect hook to fetch user details and repositories when the component mounts or when the username changes
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);

    // Function to fetch user details from the API
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/users/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || `Request failed with status code ${res.status}`
          );
        }
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Set error message if fetch fails
        setError(error.message);
      } finally {
        // Set loading status to false after fetching user details
        setLoadingUser(false);
      }
    };

    // Function to fetch user repositories from the API
    const fetchUserRepos = async () => {
      try {
        const res = await fetch(`/api/users/${username}/repos`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || `Request failed with status code ${res.status}`
          );
        }
        // Ensure repos data is an array and set it
        setRepos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setError(error.message);
        setRepos([]);
      } finally {
        // Set loading status to false after fetching repositories
        setLoadingRepos(false);
      }
    };

    // Reset states before fetching new data
    setError(null);
    setUser(null);
    setRepos([]);
    setLoadingUser(true);
    setLoadingRepos(true);

    // Fetch user details and repositories
    fetchUserDetails();
    fetchUserRepos();
    // Dependency array ensures effect runs when username changes
  }, [username]);

  // Display a loading message while user details and repositories are being fetched
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

  // Display an error message if there was an issue fetching the data
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
  // Display a message if no user details were found
  if (!user) {
    return <p className="centered-message">No user details found</p>;
  }

  return (
    <div className="container mt-4 mb-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate("/")}>
        Back to Search
      </button>
      <div className="card mb-4">
        <div className="card-body d-flex align-items-center">
          <img
            src={user.avatar_url}
            alt={`Avatar of ${user.login}`}
            className="img-thumbnail mb-3"
            style={{
              width: "250px",
              height: "250px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <div className="ms-3">
            <h1 className="card-title">{user.name || user.login}</h1>
            {user.bio && <p className="card-text">{user.bio}</p>}
            <p className="card-text">
              <strong>{user.followers}</strong> Followers,{" "}
              <strong>{user.following}</strong> Following
            </p>
            {user.location && (
              <p className="card-text">
                <i className="bi bi-geo-alt"></i> {user.location}
              </p>
            )}
            <a
              href={user.html_url}
              className="btn btn-success"
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub Profile
            </a>
          </div>
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
