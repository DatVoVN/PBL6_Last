import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      setIsLoading(true);
      try {
        const authToken = Cookies.get("authToken");
        if (!authToken) {
          toast.error("Token not found. Please log in again.");
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
        toast.error("Failed to fetch episode details");
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
      toast.error("Token not found. Please log in again.");
      return;
    }

    setIsLoading(true);

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
        fetchEpisodes(episodeData.movieId, 1);
        setIsModalOpen(false);
        toast.success("Episode updated successfully!");
      }
    } catch (error) {
      toast.error("Error updating episode");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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
      }}
      onClick={() => setIsModalOpen(false)}>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          width: "400px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Edit Episode
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold" }}>
              Episode Name
            </label>
            <input
              type="text"
              value={episodeData.name}
              onChange={(e) =>
                setEpisodeData({ ...episodeData, name: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold" }}>
              Episode Number
            </label>
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
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold" }}>
              Is Free
            </label>
            <input
              type="checkbox"
              checked={episodeData.isFree}
              onChange={() =>
                setEpisodeData({ ...episodeData, isFree: !episodeData.isFree })
              }
              style={{ marginLeft: "10px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold" }}>
              Status
            </label>
            <select
              value={episodeData.status}
              onChange={(e) =>
                setEpisodeData({
                  ...episodeData,
                  status: e.target.value === "true" ? true : false,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}>
              <option value={true}>Active</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "10px 15px",
              margin: "5px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
            }}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            style={{
              padding: "10px 15px",
              margin: "5px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "#f44336",
              color: "white",
            }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEpisode;
