import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// Import Bootstrap for styling
import "bootstrap/dist/css/bootstrap.min.css";
// Custom styles for the application
import "./styles.css";

// Render the root component of the React app
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  // Attach the React app to the root element in the HTML
  document.getElementById("root")
);
