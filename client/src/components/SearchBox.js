import React, { useState, useEffect } from "react";

const SearchBox = ({ onSearch }) => {
  // State to manage the input value
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Clear input when the component mounts or certain conditions are met
    setUsername("");
  }, []);

  const handleSubmit = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Trigger the search with the current username
    onSearch(username);
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div
        className="card p-4 shadow"
        style={{
          width: "50%",
          backgroundColor: "#343a40",
          borderRadius: "10px",
        }}
      >
        <form onSubmit={handleSubmit} className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search GitHub User..."
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={{ borderRadius: "5px", padding: "10px" }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: "10px 20px", borderRadius: "5px" }}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;
