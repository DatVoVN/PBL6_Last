import { HiPencilAlt } from "react-icons/hi";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; // Import toastify

function EditEpisode({ episodeId, setIsModalOpen, fetchEpisodes }) {
  const [episodeData, setEpisodeData] = useState({
    episodeId: 0,
    movieId: 0,
    name: "",
    episodeNumber: 1,
    isFree: false,
    status: true,
    createdDate: "",
    updatedDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const MOVIE = import.meta.env.VITE_MOVIE;
  // Fetch episode details based on episodeId
  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      setIsLoading(true);
      try {
        const authToken = Cookies.get("authToken");
        if (!authToken) {
          console.error("Token not found. Please log in again.");
          return;
        }

        const response = await axios.get(`${MOVIE}/api/episodes/${episodeId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.status === 200 && response.data.result) {
          const episode = response.data.result.episode;
          setEpisodeData({
            episodeId: episode.episodeId,
            movieId: episode.movieId,
            name: episode.name,
            episodeNumber: episode.episodeNumber,
            isFree: episode.isFree,
            status: episode.status,
            createdDate: episode.createdDate,
            updatedDate: episode.updatedDate,
          });
        }
      } catch (error) {
        console.error("Error fetching episode details:", error);
        toast.error("Failed to fetch episode details"); // Hiển thị thông báo lỗi
      } finally {
        setIsLoading(false);
      }
    };

    if (episodeId) {
      fetchEpisodeDetails();
    }
  }, [episodeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Token not found. Please log in again.");
      toast.error("Token not found. Please log in again."); // Hiển thị thông báo lỗi nếu không có token
      return;
    }

    setIsLoading(true);

    // Prepare data only with necessary fields
    const updatedEpisodeData = {
      episodeId: episodeData.episodeId,
      movieId: episodeData.movieId,
      name: episodeData.name,
      episodeNumber: episodeData.episodeNumber,
      isFree: episodeData.isFree,
      status: episodeData.status,
      createdDate: episodeData.createdDate,
      updatedDate: episodeData.updatedDate,
    };

    try {
      const response = await axios.put(
        `${MOVIE}/api/episodes`,
        updatedEpisodeData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        fetchEpisodes(episodeData.movieId); // Refresh the episode list after updating
        setIsModalOpen(false); // Close the modal after success
        toast.success("Episode updated successfully!"); // Hiển thị thông báo thành công
      }
    } catch (error) {
      console.error("Error updating episode:", error);
      toast.error("Error updating episode"); // Hiển thị thông báo lỗi
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Episode</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Episode Name</label>
            <input
              type="text"
              value={episodeData.name}
              onChange={(e) =>
                setEpisodeData({ ...episodeData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Episode Number</label>
            <input
              type="number"
              value={episodeData.episodeNumber}
              onChange={(e) =>
                setEpisodeData({
                  ...episodeData,
                  episodeNumber: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <label>Is Free</label>
            <input
              type="checkbox"
              checked={episodeData.isFree}
              onChange={() =>
                setEpisodeData({ ...episodeData, isFree: !episodeData.isFree })
              }
            />
          </div>
          <div>
            <label>Status</label>
            <select
              value={episodeData.status}
              onChange={(e) =>
                setEpisodeData({
                  ...episodeData,
                  status: e.target.value === "true" ? true : false,
                })
              }>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEpisode;
