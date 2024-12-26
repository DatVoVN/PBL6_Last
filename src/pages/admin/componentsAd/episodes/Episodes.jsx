import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import AddEpisode from "./AddEpisode";
import EditEpisode from "./EditEpisode";
import DeleteEpisode from "./DeleteEpisode";
import FetchServer from "./FetchServer"; // Import FetchServer
import "./Episode.css";
import { ToastContainer } from "react-toastify";
import { HiEye, HiPencilAlt, HiFire } from "react-icons/hi";

const TABLE_HEADS = ["Episode ID", "Name", "isFree", "Status", "Action"];

function Episodes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [episodeToEdit, setEpisodeToEdit] = useState(null);
  const MOVIE = import.meta.env.VITE_MOVIE;
  const fetchMovies = async (name) => {
    try {
      const response = await axios.get(
        `${MOVIE}/api/movies?Name=${name}&PageNumber=1&PageSize=25`
      );
      setMovies(response.data.result || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchEpisodes = async (movieId) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Token not found.");
      return;
    }

    try {
      const response = await axios.get(
        `${MOVIE}/api/episodes?MovieId=${movieId}&PageNumber=1&PageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setEpisodes(response.data.result || []);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  };

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
    fetchEpisodes(movie.movie.movieId);
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

  return (
    <div className="episodes-page">
      <h1>Search Movies</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter movie name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsTyping(true);
          }}
          className="search-input"
        />
      </div>

      {movies.length > 0 && isTyping && (
        <ul className="suggestion-list">
          {movies.map((movie) => (
            <li
              key={movie.movie.movieId}
              onClick={() => handleSelectMovie(movie)}>
              {movie.movie.name}
            </li>
          ))}
        </ul>
      )}

      {selectedMovie && (
        <div className="movie-detail">
          <h2>{selectedMovie.movie.name}</h2>
          <section className="content-area-table">
            <ToastContainer autoClose={2000} />
            <div className="data-table-info">
              <h4>EPISODES</h4>
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
                          <HiEye size={20} />
                          <HiPencilAlt
                            size={20}
                            onClick={() => handleEditEpisode(episode)}
                          />
                          <DeleteEpisode
                            episodeId={episode.episodeId}
                            onDeleteSuccess={handleDeleteEpisodeSuccess}
                          />
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
