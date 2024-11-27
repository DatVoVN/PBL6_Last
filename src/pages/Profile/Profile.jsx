import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Retrieve user data from the cookie
    const userData = Cookies.get("userData");

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setProfileData(parsedData.result.user); // Access the user object
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  if (!profileData) {
    return <p>Loading profile...</p>;
  }

  const { email, fullName, avatar, gender, dateOfBirth } = profileData;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="avatar-wrapper">
          <img
            src={avatar || "https://via.placeholder.com/150"} // Fallback to placeholder if avatar is null
            alt="User Avatar"
            className="profile-avatar"
          />
        </div>
      </div>
      <div className="profile-details">
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Full Name:</strong> {fullName}
        </p>
        <p>
          <strong>Gender:</strong> {gender}
        </p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {new Date(dateOfBirth).toLocaleDateString()}
        </p>
      </div>
      <div className="profile-actions">
        <Link to="/change-password" className="change-password-btn">
          Change Password
        </Link>
      </div>
    </div>
  );
};

export default Profile;
