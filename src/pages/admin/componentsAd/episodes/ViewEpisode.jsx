import React, { useState } from "react";
import { HiEye } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // Import js-cookie

function ViewEpisode({ episodeId }) {
  const [episodeData, setEpisodeData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewEpisode = async () => {
    setIsLoading(true);

    // Get the auth token from cookies
    const authToken = Cookies.get("authToken");

    try {
      const response = await axios.get(
        `https://cineworld.io.vn:7001/api/episodes/${episodeId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Add the auth token in the Authorization header
          },
        }
      );

      if (response.data.isSuccess) {
        setEpisodeData(response.data.result);
        setIsModalOpen(true);
      } else {
        toast.error(
          response.data.message || "Failed to fetch episode details."
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching data.";
      console.error("Error fetching episode:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HiEye
        size={20}
        style={{ marginRight: "10px", cursor: "pointer" }}
        onClick={handleViewEpisode}
      />

      {isModalOpen && episodeData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              width: "400px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              maxHeight: "90vh",
              overflowY: "auto", // Ensures modal content is scrollable on smaller screens
            }}>
            <h2>Episode Details</h2>
            <p>
              <strong>Episode Name:</strong> {episodeData.episode.name}
            </p>
            <p>
              <strong>Episode Number:</strong>{" "}
              {episodeData.episode.episodeNumber}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {episodeData.episode.status ? "Active" : "Inactive"}
            </p>
            <p>
              <strong>Created Date:</strong>{" "}
              {new Date(episodeData.episode.createdDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Updated Date:</strong>{" "}
              {new Date(episodeData.episode.updatedDate).toLocaleDateString()}
            </p>

            <h3>Servers</h3>
            {episodeData.servers.length === 0 ? (
              <p>No servers available</p>
            ) : (
              episodeData.servers.map((server) => (
                <div key={server.serverId}>
                  <p>
                    <strong>Server Name:</strong> {server.name}
                  </p>
                  <a
                    href={server.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                    }}>
                    Watch Here
                  </a>
                </div>
              ))
            )}

            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
              onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewEpisode;
