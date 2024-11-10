import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css"; // Optional: Style it as needed

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This goes back to the previous page
  };

  return (
    <button className="back-button" onClick={handleGoBack}>
      ⬅ Back
    </button>
  );
};

export default BackButton;
