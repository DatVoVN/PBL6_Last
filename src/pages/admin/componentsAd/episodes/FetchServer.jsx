import React, { useState } from "react";
import { HiFire } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function FetchServer({ episodeId }) {
  const [serverData, setServerData] = useState(null);
  const [formData, setFormData] = useState({ name: "", link: "" });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const MOVIE = import.meta.env.VITE_MOVIE;

  const fetchServerData = async () => {
    setLoading(true);
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      toast.error("You need to log in to fetch server data.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${MOVIE}/api/servers/${episodeId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200 && response.data && response.data.result) {
        setServerData(response.data.result);
        setFormData({
          name: response.data.result.name,
          link: response.data.result.link,
        });
        setIsModalOpen(true);
      } else {
        toast.error("Failed to fetch server data.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setIsModalOpen(true); // Open modal for adding server
        toast.info("Server not found. You can add a new server.");
      } else {
        toast.error("Error occurred while fetching server data.");
        console.error("Error fetching server data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddServer = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      toast.error("You need to log in to add server.");
      return;
    }

    const newServerData = {
      serverId: 0, // Server mới, đặt là 0
      episodeId: episodeId, // Sử dụng ID của episode hiện tại
      name: formData.name,
      link: formData.link,
    };

    try {
      const response = await axios.post(`${MOVIE}/api/servers`, newServerData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(`Server added successfully: ${response.data.message}`);
        console.log("Response:", response.data); // Log toàn bộ phản hồi
        setServerData(response.data.result); // Cập nhật dữ liệu server mới
        setIsModalOpen(false);
      } else {
        toast.error(`Failed to add server: ${response.data.message}`);
        console.log("Response:", response.data); // Log toàn bộ phản hồi
      }
    } catch (error) {
      if (error.response) {
        // Hiển thị thông tin phản hồi từ server nếu có
        const errorMessage =
          error.response.data.message || "Unknown error occurred.";
        toast.error(`Error: ${errorMessage}`);
        console.error("Error Response:", error.response.data); // Log toàn bộ phản hồi
      } else {
        // Lỗi không từ phản hồi (network hoặc khác)
        toast.error("Network error occurred.");
        console.error("Error:", error);
      }
    }
  };

  const handleEditServer = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      toast.error("You need to log in to edit server.");
      return;
    }

    if (!serverData) {
      toast.error("No server data to update.");
      return;
    }

    const updatedData = {
      serverId: serverData.serverId,
      episodeId: episodeId,
      name: formData.name,
      link: formData.link,
    };

    try {
      const response = await axios.put(`${MOVIE}/api/servers`, updatedData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        toast.success("Server updated successfully!");
        setServerData(response.data.result);
        setIsEditing(false);
      } else {
        toast.error("Failed to update server.");
      }
    } catch (error) {
      toast.error("Error occurred while updating server.");
      console.error("Error updating server:", error);
    }
  };

  const handleDeleteServer = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      toast.error("You need to log in to delete server.");
      return;
    }

    try {
      const response = await axios.delete(
        `${MOVIE}/api/servers?id=${serverData.serverId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 204) {
        toast.success("Server deleted successfully!");
        setServerData(null);
        setIsEditing(false);
        setIsModalOpen(false);
      } else {
        toast.error("Failed to delete server.");
      }
    } catch (error) {
      toast.error("Error occurred while deleting server.");
      console.error("Error deleting server:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setServerData(null);
    setFormData({ name: "", link: "" });
  };

  return (
    <div>
      <HiFire
        size={20}
        style={{ cursor: "pointer", marginRight: "10px" }}
        onClick={fetchServerData}
      />

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
          onClick={closeModal}>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "500px",
              maxHeight: "80%",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? "Edit Server" : "Server Details"}</h2>

            {(isEditing || !serverData) && (
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Server Name"
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                />
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="Server URL"
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                />
                <button
                  onClick={isEditing ? handleEditServer : handleAddServer}
                  style={{
                    display: "block",
                    marginTop: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    width: "100%",
                  }}>
                  {isEditing ? "Save Changes" : "Add Server"}
                </button>
              </div>
            )}

            {!isEditing && serverData && (
              <div>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    width: "100%",
                  }}>
                  Edit Server
                </button>
                <button
                  onClick={handleDeleteServer}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    width: "100%",
                  }}>
                  Delete Server
                </button>
              </div>
            )}

            <button
              onClick={closeModal}
              style={{
                display: "block",
                marginTop: "20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "5px",
                width: "100%",
              }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FetchServer;
