import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetailAd.css";
import Cookies from "js-cookie";

const MovieDetailAd = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(
          `https://cineworld.io.vn:7001/api/movies/${movieId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (data.isSuccess) {
          setMovie(data.result);
        } else {
          console.error("Failed to fetch movie details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found.</div>;

  return (
    <div className="movie-detail-container">
      <div className="movie-header">
        <img
          src={movie.movie.imageUrl}
          alt={movie.movie.name}
          className="movie-image"
        />
      </div>

      <div className="movie-info">
        <p>
          <strong>Original Name:</strong> {movie.movie.originName}
        </p>
      </div>

      <div className="movie-description">
        <p>
          <strong>Description:</strong> {movie.movie.description}
        </p>
      </div>

      <div className="movie-info">
        <div className="movie-info-left">
          <p>
            <strong>Current Episode:</strong>{" "}
            {movie.movie.episodeCurrent || "N/A"}
          </p>
          <p>
            <strong>Total Episodes:</strong> {movie.movie.episodeTotal || "N/A"}
          </p>
        </div>

        <div className="movie-info-right">
          <p>
            <strong>Year:</strong> {movie.movie.year}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {movie.movie.status ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      <div className="movie-extra-info">
        <div className="extra-left">
          <p>
            <strong>Category:</strong> {movie.category.name}
          </p>
          <p>
            <strong>Is Hot:</strong> {movie.movie.isHot ? "Hot" : "Not Hot"}
          </p>
        </div>

        <div className="extra-right">
          <p>
            <strong>Country:</strong> {movie.country.name}
          </p>
          <p>
            <strong>Updated Date:</strong> {movie.movie.updatedDate}
          </p>
        </div>
      </div>

      <p>
        <a
          href={movie.movie.trailer}
          target="_blank"
          rel="noopener noreferrer"
          className="trailer-link">
          Watch Trailer
        </a>
      </p>
    </div>
  );
};

export default MovieDetailAd;
