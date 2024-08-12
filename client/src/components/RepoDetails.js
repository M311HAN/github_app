import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Component to display details of a specific repository
const RepoDetails = ({ owner }) => {
  // Extract the repository name from the URL parameters
  const { repoName } = useParams();
  // Hook to navigate programmatically
  const navigate = useNavigate();
  // State to store repository details
  const [repoDetails, setRepoDetails] = useState(null);
  // State to store the last 5 commits
  const [commits, setCommits] = useState([]);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to manage error messages
  const [error, setError] = useState(null);

  useEffect(() => {
    resetState();

    // Function to fetch repository details and commits
    const fetchRepoDetails = async () => {
      try {
        // Fetch repository data
        const repoData = await fetchRepoData(owner);
        // Find the specific repository by name
        const selectedRepo = findRepoByName(repoData, repoName);
        // Set the repository details
        setRepoDetails(selectedRepo);

        const commitsData = await fetchCommitsData(owner, repoName);
        // Store the last 5 commits
        setCommits(commitsData.slice(0, 5));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch repository details and commits on component mount
    // Dependency array ensures effect runs when owner or repoName changes
    fetchRepoDetails();
  }, [owner, repoName]);

  // Function to reset the component state
  const resetState = () => {
    setRepoDetails(null);
    setCommits([]);
    setLoading(true);
    setError(null);
  };

  // Function to fetch repository data from the API
  const fetchRepoData = async (owner) => {
    const repoRes = await fetch(`/api/users/${owner}/repos`);
    const repoData = await repoRes.json();
    if (!repoRes.ok) {
      throw new Error(
        repoData.error || `Request failed with status code ${repoRes.status}`
      );
    }
    return repoData;
  };

  // Function to find a specific repository by name in the fetched data
  const findRepoByName = (repoData, repoName) => {
    const selectedRepo = repoData.find((repo) => repo.name === repoName);
    if (!selectedRepo) {
      throw new Error("Repository not found");
    }
    return selectedRepo;
  };

  // Function to fetch commits data from the API
  const fetchCommitsData = async (owner, repoName) => {
    const commitsRes = await fetch(`/api/repos/${owner}/${repoName}/commits`);
    const commitsData = await commitsRes.json();
    if (!commitsRes.ok) {
      throw new Error(
        commitsData.error ||
          `Request failed with status code ${commitsRes.status}`
      );
    }
    return commitsData;
  };
  // Display a loading message while data is being fetched
  if (loading) {
    return <p className="loader-text">Loading repository details...</p>;
  }
  // Display an error message if there was an issue fetching the data
  if (error) {
    return (
      <div className="centered-message">
        <p>Error: {error}</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Back to Repositories
        </button>
      </div>
    );
  }
  // Display a message if no repository details were found
  if (!repoDetails) {
    return <p className="loading-text">No repository details found</p>;
  }

  return (
    <div className="container mt-4 mb-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
        Back to Repositories
      </button>
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">
            <a
              href={repoDetails.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "green", textDecoration: "underline" }}
            >
              {repoDetails.name}
            </a>
          </h2>
          <p className="card-text">{repoDetails.description}</p>
          <p className="card-text">
            <strong>Created at:</strong>{" "}
            {new Date(repoDetails.created_at).toLocaleDateString()}
          </p>
          <p className="card-text">
            <strong>Last updated:</strong>{" "}
            {new Date(repoDetails.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h3>Last 5 Commits</h3>
      <ul className="list-group">
        {commits.map((commit) => (
          <li key={commit.sha} className="list-group-item">
            <p className="mb-1">
              <strong>Message:</strong> {commit.commit.message}
            </p>
            <p className="mb-0">
              <strong>Date:</strong>{" "}
              {new Date(commit.commit.author.date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoDetails;
