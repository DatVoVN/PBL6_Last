import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Profile.css";
import Spinner from "../../components/Spinner/Spinner";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [updatedInfo, setUpdatedInfo] = useState({
    id: null,
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
  const [showAvatarEdit, setShowAvatarEdit] = useState(false); // Show the edit option on hover

  useEffect(() => {
    // Retrieve userId from the cookie
    const userId = Cookies.get("userId");
    const tokenAuth = Cookies.get("authToken"); // Retrieve token from cookies

    if (userId && tokenAuth) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `https://cineworld.io.vn:7000/api/users/GetById?id=${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${tokenAuth}`, // Include Bearer token
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          if (data && data.result) {
            const user = data.result; // Assuming the response structure contains the user object

            setProfileData(user);
            setUpdatedInfo({
              id: user.id,
              fullName: user.fullName,
              avatar: user.avatar,
              gender: user.gender,
              dateOfBirth: user.dateOfBirth,
              createdDate: user.createdDate,
            });
            setAvatarPreview(user.avatar); // Set avatar preview to the user's current avatar
          }
        } catch (error) {
          setError("Failed to fetch user information");
          console.error(error);
        }
      };

      fetchUserData();
    }
  }, []); // Run once on component mount

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    const tokenAuth = Cookies.get("authToken"); // Retrieve token from cookies

    updatedInfo.dateOfBirth = new Date(updatedInfo.dateOfBirth).toISOString(); // Ensure date format

    const { createdDate, ...updatedInfoWithoutCreatedDate } = updatedInfo;

    try {
      const response = await fetch(
        "https://cineworld.io.vn:7000/api/users/UpdateInformation",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenAuth}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(updatedInfoWithoutCreatedDate),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(
          "Failed to update information: " +
            (errorData.message || "Unknown error")
        );
      }

      const data = await response.json();
      setProfileData((prev) => ({ ...prev, ...updatedInfoWithoutCreatedDate }));
      setIsEditing(false);

      // Reload the page after successful update
      window.location.reload();
    } catch (error) {
      console.error("Error updating information:", error);
      if (error instanceof TypeError) {
        setError(
          "Network error: Failed to fetch. Please check your connection or the server."
        );
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();

      // Append the file with additional details like name and type
      formData.append("file", file, "avatar.jpg");

      setLoading(true);
      const tokenAuth = Cookies.get("authToken"); // Retrieve token from cookies

      // Send the FormData object to the server via POST request
      fetch(
        `https://cineworld.io.vn:7000/api/users/updateAvatar?folder=user_avatars`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenAuth}`, // Add token to headers
          },
          body: formData, // Attach the FormData object to the body
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update avatar");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Avatar updated successfully:", data);
          setAvatarPreview(URL.createObjectURL(file)); // Preview the uploaded avatar
        })
        .catch((error) => {
          console.error("Error updating avatar:", error);
          setError("Failed to update avatar");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  if (!profileData) {
    return <Spinner />;
  }

  const { email, fullName, gender, dateOfBirth } = profileData;

  return (
    <div className="profile">
      <div className="profile-header">
        <div
          className="avatar-wrapper"
          onMouseEnter={() => setShowAvatarEdit(true)} // Show edit button on hover
          onMouseLeave={() => setShowAvatarEdit(false)} // Hide edit button on hover out
        >
          <img
            src={avatarPreview || "https://via.placeholder.com/150"} // Use preview or fallback
            alt="User Avatar"
            className="profile-avatar"
          />
          {showAvatarEdit && ( // Display edit button on hover
            <label className="avatar-edit-button">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange} // Handle avatar change
                style={{ display: "none" }}
              />
              Change Avatar
            </label>
          )}
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
