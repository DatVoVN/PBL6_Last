import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import AddEpisode from "./AddEpisode";
import EditEpisode from "./EditEpisode";
import DeleteEpisode from "./DeleteEpisode";
import FetchServer from "./FetchServer";
import "./Episode.css";
import { ToastContainer } from "react-toastify";
import { HiEye, HiPencilAlt, HiFire } from "react-icons/hi";
import ViewEpisode from "./ViewEpisode";

const TABLE_HEADS = [
  "Episode ID",
  "Name",
  "isFree",
  "Status",
  "Action",
  "Fetch Server",
];

function Episodes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [episodeToEdit, setEpisodeToEdit] = useState(null);
  const [totalPagesEpisodes, setTotalPagesEpisodes] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const MOVIE = import.meta.env.VITE_MOVIE;
  const fetchMovies = async (name) => {
    try {
      const response = await axios.get(
        `${MOVIE}/api/movies?Name=${name}&PageNumber=1&PageSize=2000`
      );
      setMovies(response.data.result || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchEpisodes = async (movieId, pageNumber) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Token not found.");
      return;
    }

    try {
      const response = await axios.get(
        `${MOVIE}/api/episodes?MovieId=${movieId}&PageNumber=${pageNumber}&PageSize=4`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setEpisodes(response.data.result || []);
      setTotalPagesEpisodes(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  };
  useEffect(() => {
    if (selectedMovie) {
      fetchEpisodes(selectedMovie.movie.movieId, currentPage);
    }
  }, [selectedMovie, currentPage]);
  useEffect(() => {
    if (!searchTerm.trim()) {
      setMovies([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchMovies(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    fetchEpisodes(movie.movie.movieId, currentPage);
    setSearchTerm("");
    setMovies([]);
  };

  const handleEditEpisode = (episode) => {
    setEpisodeToEdit(episode);
    setIsEditModalOpen(true);
  };

  const handleDeleteEpisodeSuccess = (deletedEpisodeId) => {
    setEpisodes(
      episodes.filter((episode) => episode.episodeId !== deletedEpisodeId)
    );
  };
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPagesEpisodes) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="episodes-page">
      <h4
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
        SEARCH MOVIES
      </h4>

      <div
        className="search-bar"
        style={{ position: "relative", marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter movie name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsTyping(true);
          }}
          className="search-input"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>

      {movies.length > 0 && isTyping && (
        <ul className="suggestion-list">
          {movies.map((movie) => (
            <li
              key={movie.movie.movieId}
              onClick={() => handleSelectMovie(movie)}
              style={{
                padding: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}>
              {movie.movie.name}
            </li>
          ))}
        </ul>
      )}

      {selectedMovie && (
        <div className="movie-detail">
          <h2
            style={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#475be8",
              margin: "20px 0",
            }}>
            {selectedMovie.movie.name}
          </h2>
          <section className="content-area-table">
            <ToastContainer autoClose={2000} />
            <div className="data-table-info">
              <div className="buttons-container">
                <button
                  className="add-category-btn"
                  onClick={() => setIsModalOpen(true)}>
                  Add Episode
                </button>
              </div>
            </div>

            <div className="data-table-diagram">
              <table>
                <thead>
                  <tr>
                    {TABLE_HEADS.map((th, index) => (
                      <th key={index}>{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {episodes.length > 0 ? (
                    episodes.map((episode) => (
                      <tr key={episode.episodeId}>
                        <td>{episode.episodeId}</td>
                        <td>{episode.name}</td>
                        <td>{episode.isFree ? "Free" : "Paid"}</td>
                        <td
                          className={`status-cell ${
                            episode.status ? "status-active" : "status-inactive"
                          }`}>
                          {episode.status ? "Active" : "Inactive"}
                        </td>
                        <td>
                          <ViewEpisode episodeId={episode.episodeId} />
                          <HiPencilAlt
                            size={20}
                            style={{ marginRight: "10px", color: "gold" }}
                            onClick={() => handleEditEpisode(episode)}
                          />
                          <DeleteEpisode
                            episodeId={episode.episodeId}
                            onDeleteSuccess={handleDeleteEpisodeSuccess}
                          />
                        </td>
                        <td
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          <FetchServer episodeId={episode.episodeId} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={TABLE_HEADS.length}>No episodes found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}>
                Previous
              </button>
              <span
                style={{
                  color: "red",
                }}>{`Page ${currentPage} of ${totalPagesEpisodes}`}</span>
              <button
                disabled={currentPage === totalPagesEpisodes}
                onClick={() => goToPage(currentPage + 1)}>
                Next
              </button>
            </div>
            {isModalOpen && (
              <AddEpisode
                movieId={selectedMovie.movie.movieId}
                setIsModalOpen={setIsModalOpen}
                fetchEpisodes={fetchEpisodes}
              />
            )}

            {isEditModalOpen && episodeToEdit && (
              <EditEpisode
                episodeId={episodeToEdit.episodeId}
                setIsModalOpen={setIsEditModalOpen}
                fetchEpisodes={fetchEpisodes}
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default Episodes;
