import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RepoDetails = ({ owner }) => {
  // Get the repo name from the URL parameters
  const { repoName } = useParams();
  // Hook to navigate programmatically
  const navigate = useNavigate();
  // State to store repository details
  const [repoDetails, setRepoDetails] = useState(null);
  // State to store commits
  const [commits, setCommits] = useState([]);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to manage any errors
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when component mounts
    resetState();

    const fetchRepoDetails = async () => {
      try {
        // Fetch repository data for the owner
        const repoData = await fetchRepoData(owner);
        // Find the specific repository by name
        const selectedRepo = findRepoByName(repoData, repoName);
        // Set the repository details
        setRepoDetails(selectedRepo);

        // Fetch the commits for the repository and Store the first 5 commits
        const commitsData = await fetchCommitsData(owner, repoName);
        setCommits(commitsData.slice(0, 5));
      } catch (error) {
        // Set any errors encountered during fetching
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Initiate fetching of repository details, commits and
    // Dependencies: refetch data when owner or repoName changes
    fetchRepoDetails();
  }, [owner, repoName]);

  const resetState = () => {
    // Reset state values to initial state
    setRepoDetails(null);
    setCommits([]);
    setLoading(true);
    setError(null);
  };

  const fetchRepoData = async (owner) => {
    // Fetch repository data for the given owner
    const repoRes = await fetch(`/api/users/${owner}/repos`);
    const repoData = await repoRes.json();
    if (!repoRes.ok) {
      throw new Error(
        repoData.error || `Request failed with status code ${repoRes.status}`
      );
    }
    return repoData;
  };

  const findRepoByName = (repoData, repoName) => {
    // Find the repository by its name in the fetched data
    const selectedRepo = repoData.find((repo) => repo.name === repoName);
    if (!selectedRepo) {
      throw new Error("Repository not found");
    }
    return selectedRepo;
  };

  const fetchCommitsData = async (owner, repoName) => {
    // Fetch commits for the specific repository
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

  if (loading) {
    // Show loading message while data is being fetched
    return <p className="loader-text">Loading repository details...</p>;
  }

  if (error) {
    // Show error message if any error occurred during fetching
    return (
      <div className="centered-message">
        <p>Error: {error}</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Back to Repositories
        </button>
      </div>
    );
  }

  if (!repoDetails) {
    // Show message if no repository details are found
    return <p className="loading-text">No repository details found</p>;
  }

  return (
    <div className="container mt-4 mb-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
        Back to Repositories
      </button>
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">{repoDetails.name}</h2>
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
