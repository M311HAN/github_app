import React from "react";
import { Link } from "react-router-dom";

const UserList = ({ users }) => {
  // If no users are found, display a message
  if (users.length === 0) {
    return <p className="loading-text">No users found</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {users.map((user) => (
          <div className="col-md-4 mb-4" key={user.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={user.avatar_url}
                alt={`Avatar of ${user.login}`}
                className="card-img-top img-fluid"
                style={{
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  margin: "20px auto",
                  width: "150px",
                }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{user.login}</h5>
                <p className="card-text">ID: {user.id}</p>
                <a
                  href={user.html_url}
                  className="btn btn-success mb-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Profile
                </a>
                <Link
                  to={`/users/${user.login}`}
                  className="btn btn-link text-primary"
                >
                  User's Page
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
