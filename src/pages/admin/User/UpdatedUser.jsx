import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./UpdatedUser.css";

const UpdateUser = () => {
  const location = useLocation();
  const user = location.state; // Ensure user data is passed via location state
  const [userId] = useState(user?.id || ""); // Assuming user has an `id`
  const [userName, setUserName] = useState(user?.userName || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const navigate = useNavigate();

  // Format dateOfBirth if present
  useEffect(() => {
    if (user?.dateOfBirth) {
      const formattedDate = new Date(user.dateOfBirth)
        .toISOString()
        .split("T")[0];
      setDateOfBirth(formattedDate);
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Convert file to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // This will store the Base64 string
      };
      reader.readAsDataURL(file); // Converts file to Base64
    }
  };

  const handleUpdate = async () => {
    if (!userId || !userName || !avatar || !gender || !dateOfBirth) {
      console.error("All fields are required.");
      return;
    }

    try {
      const response = await fetch(
        "https://cineworld.io.vn:7000/api/users/UpdateInformation",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
          body: JSON.stringify({
            id: userId,
            userName,
            avatar,
            gender,
            dateOfBirth,
          }), // Include userId in the body
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update user:", errorData);
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleBack = () => {
    navigate("/admin");
  };

  return (
    <div className="update-user">
      <h2>Update User Information</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>User Name:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label>Avatar:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <label>Gender:</label>
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />

        <label>Date of Birth:</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />

        <div className="button-group">
          <button onClick={handleUpdate}>Save Changes</button>
          <button type="button" onClick={handleBack} className="cancel-button">
            Back to Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
