import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "./MoviebyGenre.css";
const MoviesByGenre = () => {
  const { id } = useParams(); // id được lấy từ URL
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMoviesByGenre();
  }, []);

  const fetchMoviesByGenre = async () => {
    try {
      const response = await fetch(
        `https://localhost:7001/api/movies?genreId=${id}`
      );
      const data = await response.json();
      if (data.isSuccess) {
        setMovies(data.result);
      } else {
        setMessage("Không tìm thấy phim trong genre này: " + data.message);
      }
    } catch (error) {
      setMessage("Lỗi: " + error.message);
    }
  };
  console.log(movies);

  return (
    <div className="movies-by-category-container">
      <h1>Danh sách Phim</h1>
      {message && <p>{message}</p>}
      <ul>
        {movies.map((movie) => (
          <div key={movie.movieId} className="movie-card">
            <img
              src={movie.imageUrl}
              alt={movie.name}
              className="movie-image"
            />
            <h3>{movie.movie.name}</h3>
            <p>
              <strong>Original Name:</strong> {movie.movie.name}
            </p>
            <p>
              <strong>Url Image:</strong> {movie.movie.imageUrl}
            </p>
            <p>
              <strong>Current Episode:</strong>{" "}
              {movie.movie.episodeCurrent || "N/A"}
            </p>
            <p>
              <strong>Total Episodes:</strong>{" "}
              {movie.movie.episodeTotal || "N/A"}
            </p>
            <p>
              <strong>Duration:</strong> {movie.movie.duration}
            </p>
            <p>
              <strong>Description:</strong> {movie.movie.description}
            </p>
            <p>
              <strong>Year:</strong> {movie.movie.year}
            </p>
            <p>
              <strong>Category:</strong> {movie.category.name}
            </p>
            <p>
              <strong>Country:</strong> {movie.country.name}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {movie.movie.status ? "Active" : "Inactive"}
            </p>
            <p>
              <strong>Link Trailer</strong> {movie.movie.trailer}
            </p>
            <p>
              <strong>Genre:</strong>{" "}
              {movie.genres.map((item, index) => (
                <span key={item.genreId}>
                  {item.name}
                  {index < movie.genres.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p>
              <strong>UpdatedDate:</strong> {movie.movie.updatedDate}
            </p>
            <p>
              <strong>Is Hot:</strong> {movie.movie.isHot ? "Hot" : "Not Hot"}
            </p>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MoviesByGenre;
