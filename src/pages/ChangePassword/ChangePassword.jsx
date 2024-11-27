import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import Cookies from "js-cookie";
import "./ChangePassword.css";
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const authToken = Cookies.get("authToken");
  const navigate = useNavigate(); // Hook to navigate

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      // API request to change password
      const response = await axios.post(
        "https://cineworld.io.vn:7000/api/auth/change-password",
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("You have successfully changed your password!");
        // Optionally, you can redirect after success
        setTimeout(() => {
          navigate("/"); // Navigate to the home page or any other page
        }, 2000);
      }
    } catch (err) {
      setError("Error: Unable to change password. Please try again.");
    }
  };

  return (
    <div className="password-change-container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="password-form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="password-form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="password-form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="password-error">{error}</p>}
        {message && <p className="password-success">{message}</p>}

        <button type="submit" className="password-submit-btn">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
