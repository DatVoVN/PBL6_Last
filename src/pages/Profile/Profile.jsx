import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [updatedInfo, setUpdatedInfo] = useState({
    id: "",
    fullName: "",
    avatar: "",
    gender: "",
    dateOfBirth: "",
    createdDate: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to control form visibility
  const [avatarPreview, setAvatarPreview] = useState(""); // State for avatar preview
  const userId = Cookies.get("userId");
  useEffect(() => {
    // Retrieve user data from the cookie
    const userData = Cookies.get("userData");

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setProfileData(parsedData.result.user);
        setUpdatedInfo((prev) => ({
          ...prev,
          id: userId,
          fullName: parsedData.result.user.fullName,
          avatar: parsedData.result.user.avatar,
          gender: parsedData.result.user.gender,
          dateOfBirth: parsedData.result.user.dateOfBirth,
        }));
        setAvatarPreview(parsedData.result.user.avatar); // Set initial avatar preview
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    const tokenAuth = Cookies.get("authToken"); // Retrieve token from cookies
    console.log("Token Auth:", tokenAuth); // Log the token for debugging

    console.log("Updating with data:", updatedInfo); // Log the data being sent

    try {
      const response = await fetch(
        "https://localhost:7000/api/users/UpdateInformation",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenAuth}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(updatedInfo),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Get error details from response
        console.error("Error response:", errorData); // Log error details
        throw new Error(
          "Failed to update information: " +
            (errorData.message || "Unknown error")
        );
      }

      const data = await response.json();
      console.log("Update successful:", data);
      setProfileData((prev) => ({ ...prev, ...updatedInfo }));
      setIsEditing(false); // Hide the form after successful update
    } catch (error) {
      console.error("Error updating information:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // Set the preview URL
        setUpdatedInfo({ ...updatedInfo, avatar: reader.result }); // Store the image data in updatedInfo
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  if (!profileData) {
    return <p>Loading profile...</p>;
  }

  const { email, fullName, gender, dateOfBirth } = profileData;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="avatar-wrapper">
          <img
            src={avatarPreview || "https://via.placeholder.com/150"} // Use the preview or fallback
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
        <button
          onClick={() => setIsEditing(!isEditing)} // Toggle editing state
          className="change-password-btn"
          style={{ marginLeft: "10px" }}>
          {isEditing ? "Cancel" : "Update Information"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {isEditing && ( // Show the edit form if isEditing is true
        <div className="update-form">
          <h3>Update Profile Information</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}>
            <div>
              <label>Full Name:</label>
              <input
                type="text"
                value={updatedInfo.fullName}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, fullName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Avatar:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange} // Handle file selection
              />
            </div>
            <div>
              <label>Gender:</label>
              <select
                value={updatedInfo.gender}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, gender: e.target.value })
                }
                required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Date of Birth:</label>
              <input
                type="date"
                value={updatedInfo.dateOfBirth.split("T")[0]} // Format for input date
                onChange={(e) =>
                  setUpdatedInfo({
                    ...updatedInfo,
                    dateOfBirth: e.target.value,
                  })
                }
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
