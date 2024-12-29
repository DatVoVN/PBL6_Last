import React, { useState } from "react";
import { HiTrash } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function DeleteEpisode({ episodeId, onDeleteSuccess }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const MOVIE = import.meta.env.VITE_MOVIE;

  const handleDeleteEpisode = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      toast.error("You need to log in to delete an episode.");
      return;
    }

    try {
      const response = await axios.delete(
        `${MOVIE}/api/episodes?id=${episodeId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 204) {
        toast.success("Episode deleted successfully!");
        console.log("Episode deleted successfully");

        if (onDeleteSuccess) {
          onDeleteSuccess(episodeId);
        }
      } else {
        const errorMessage =
          response.data.Message || "Failed to delete episode.";
        toast.error(errorMessage);
        console.log("Failed to delete episode");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.Message || "Error occurred while deleting.";
      console.error("Error deleting episode:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <HiTrash
        size={20}
        style={{ marginRight: "10px", color: "red", cursor: "pointer" }}
        onClick={() => setIsDeleteModalOpen(true)}
      />

      {isDeleteModalOpen && (
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
              width: "500px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}>
            <h2>Are you sure you want to delete this episode?</h2>
            <div style={{ marginTop: "20px" }}>
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "10px 20px",
                  marginRight: "10px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleDeleteEpisode}>
                Yes
              </button>
              <button
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => setIsDeleteModalOpen(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteEpisode;
