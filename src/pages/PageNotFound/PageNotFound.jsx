import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="not-found-home-button">
        Go Back to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
