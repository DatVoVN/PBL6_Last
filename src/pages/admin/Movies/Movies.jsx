import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Movies.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch("https://cineworld.io.vn:7001/api/movies");
      const data = await response.json();
      if (data.isSuccess) {
        setMovies(data.result);
      } else {
        console.error("Failed to fetch movies:", data.message);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleDelete = async (movieId) => {
    try {
      const response = await fetch(
        `https://localhost:7001/api/movies/${movieId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setMovies(movies.filter((movie) => movie.movieId !== movieId));
        console.log("Movie deleted successfully.");
      } else {
        console.error("Failed to delete the movie.");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleUpdate = (movie) => {
    navigate(`/admin/update-movie/${movie.movieId}`, { state: movie });
  };

  const handleViewDetails = (movieId) => {
    console.log("Navigating to movie ID:", movieId); // Log the movieId
    navigate(`/admin/movies/${movieId}`);
  };

  return (
    <div className="movie-list">
      <table className="movies-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Current Episode</th>
            <th>Country</th>
            <th>Updated Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.movie.movieId}>
              <td>
                <img
                  src={movie.movie.imageUrl}
                  alt={movie.movie.name}
                  className="movie-image"
                />
              </td>
              <td>{movie.movie.name}</td>
              <td>{movie.movie.episodeCurrent || "N/A"}</td>
              <td>{movie.country.name}</td>
              <td>{movie.movie.updatedDate}</td>
              <td className="movie-actions">
                <button onClick={() => handleViewDetails(movie.movie.movieId)}>
                  View Details
                </button>
                <button onClick={() => handleUpdate(movie)}>Update</button>
                <button onClick={() => handleDelete(movie.movie.movieId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Movies;
