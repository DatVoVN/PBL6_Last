import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS

function AddEpisode({ movieId, setIsModalOpen, fetchEpisodes }) {
  const [name, setName] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [isFree, setIsFree] = useState(false);
  const [status, setStatus] = useState(true); // Keep status as a boolean
  const [isLoading, setIsLoading] = useState(false);
  const MOVIE = import.meta.env.VITE_MOVIE;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Token not found. Please log in again.");
      return;
    }

    // Create the episode data to be sent
    const newEpisode = {
      episodeId: 0,
      movieId,
      name,
      episodeNumber,
      isFree,
      status,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    setIsLoading(true);

    try {
      // Send POST request to the API to add the new episode
      const response = await axios.post(
        `${MOVIE}/api/episodes`, // Your API endpoint
        newEpisode, // Data being sent to the API
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Authentication token in headers
          },
        }
      );

      // Handle successful response
      if (response.status === 201) {
        fetchEpisodes(movieId); // Refresh the episodes list after adding
        setIsModalOpen(false); // Close the modal on success
        toast.success("Episode added successfully!"); // Hiển thị thông báo thành công
      }
    } catch (error) {
      // Handle error response
      console.error(
        "Error adding episode:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to add episode!"); // Hiển thị thông báo lỗi
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Episode</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Episode Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Episode Number</label>
            <input
              type="number"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label>Is Free</label>
            <input
              type="checkbox"
              checked={isFree}
              onChange={() => setIsFree(!isFree)}
            />
          </div>
          <div>
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value === "true")}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Episode"}
          </button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEpisode;