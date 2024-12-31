import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "./Profile.css";
import Spinner from "../../components/Spinner/Spinner";
const USER = import.meta.env.VITE_USER;
const MEMBERSHIP = import.meta.env.VITE_MEMBERSHIP;
const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [membershipData, setMembershipData] = useState(null);
  const [isMember, setIsMember] = useState(false);
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
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);

  useEffect(() => {
    const userId = Cookies.get("userId");
    const tokenAuth = Cookies.get("authToken");

    if (userId && tokenAuth) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `${USER}/api/users/GetById?id=${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${tokenAuth}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          if (data && data.result) {
            const user = data.result;

            setProfileData(user);
            setUpdatedInfo({
              id: user.id,
              fullName: user.fullName,
              avatar: user.avatar,
              gender: user.gender,
              dateOfBirth: user.dateOfBirth,
              createdDate: user.createdDate,
            });
            setAvatarPreview(user.avatar);
            checkMembership(user.email);
          }
        } catch (error) {
          setError("Failed to fetch user information");
          console.error(error);
        }
      };

      fetchUserData();
    }
  }, []);

  const checkMembership = async (email) => {
    try {
      const response = await fetch(`${MEMBERSHIP}/api/memberships/${email}`);

      if (!response.ok) {
        throw new Error("Failed to fetch membership status");
      }

      const data = await response.json();
      if (data && data.isSuccess && data.result) {
        setIsMember(true);
        setMembershipData(data.result);
      } else {
        setIsMember(false);
        setMembershipData(null);
      }
    } catch (error) {
      console.error("Error checking membership status:", error);
      setIsMember(false);
      setMembershipData(null);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    const tokenAuth = Cookies.get("authToken");

    updatedInfo.dateOfBirth = new Date(updatedInfo.dateOfBirth).toISOString();

    const { createdDate, ...updatedInfoWithoutCreatedDate } = updatedInfo;

    try {
      const response = await fetch(`${USER}/api/users/UpdateInformation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenAuth}`,
        },
        body: JSON.stringify(updatedInfoWithoutCreatedDate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Failed to update information: " +
            (errorData.message || "Unknown error")
        );
      }

      const data = await response.json();
      setProfileData((prev) => ({ ...prev, ...updatedInfoWithoutCreatedDate }));
      setIsEditing(false);

      window.location.reload();
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
      const formData = new FormData();
      formData.append("file", file, "avatar.jpg");

      setLoading(true);
      const tokenAuth = Cookies.get("authToken");

      fetch(`${USER}/api/users/updateAvatar?folder=user_avatars`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenAuth}`,
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update avatar");
          }
          return response.json();
        })
        .then((data) => {
          setAvatarPreview(URL.createObjectURL(file));
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
          onMouseEnter={() => setShowAvatarEdit(true)}
          onMouseLeave={() => setShowAvatarEdit(false)}>
          <img
            src={avatarPreview || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="profile-avatar"
          />
          {showAvatarEdit && (
            <label className="avatar-edit-button">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
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
        <p>
          <strong>Membership Status:</strong>{" "}
          {isMember ? (
            <span>
              Member (Expires on:{" "}
              {new Date(membershipData?.expirationDate).toLocaleDateString()})
            </span>
          ) : (
            "You are not a member"
          )}
        </p>
      </div>
      <div className="profile-actions">
        <Link to="/change-password" className="change-password-btn">
          Change Password
        </Link>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="change-password-btn"
          style={{ marginLeft: "10px" }}>
          {isEditing ? "Cancel" : "Update Information"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {isEditing && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "500px",
            backgroundColor: "#f9f9f9",
          }}>
          <h3
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
              color: "#1fc3f9",
              background: "linear-gradient(to right, #00ffe8, #db8e00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}>
            UPDATE PROFILE
          </h3>
          <form
            style={{ backgroundColor: "#f9f9f9" }}
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}>
            <div style={{ marginBottom: "15px", backgroundColor: "#f9f9f9" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "black",
                }}>
                Full Name:
              </label>
              <input
                type="text"
                value={updatedInfo.fullName}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, fullName: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "black",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "black",
                }}>
                Gender:
              </label>
              <select
                value={updatedInfo.gender}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, gender: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "black",
                }}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "black",
                }}>
                Date of Birth:
              </label>
              <input
                type="date"
                value={updatedInfo.dateOfBirth.split("T")[0]}
                onChange={(e) =>
                  setUpdatedInfo({
                    ...updatedInfo,
                    dateOfBirth: e.target.value,
                  })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: loading ? "#ccc" : "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
              }}>
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
