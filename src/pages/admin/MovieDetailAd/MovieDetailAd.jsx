import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetailAd.css";
import Cookies from "js-cookie";
const MovieDetailAd = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("Movie ID from URL:", movieId);
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(
          `https://localhost:7001/api/movies/${movieId}`,
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
    <div className="movie-detail">
      <h1>{movie.movie.name}</h1>
      <img src={movie.movie.imageUrl} alt={movie.movie.name} />
      <p>
        <strong>Original Name:</strong> {movie.movie.originName}
      </p>
      <p>
        <strong>Description:</strong> {movie.movie.description}
      </p>
      <p>
        <strong>Current Episode:</strong> {movie.movie.episodeCurrent || "N/A"}
      </p>
      <p>
        <strong>Total Episodes:</strong> {movie.movie.episodeTotal || "N/A"}
      </p>
      <p>
        <strong>Duration:</strong> {movie.movie.duration}
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
        <strong>Status:</strong> {movie.movie.status ? "Active" : "Inactive"}
      </p>
      <p>
        <strong>Link Trailer:</strong>{" "}
        <a href={movie.movie.trailer} target="_blank" rel="noopener noreferrer">
          Watch Trailer
        </a>
      </p>
      <p>
        <strong>Updated Date:</strong> {movie.movie.updatedDate}
      </p>
      <p>
        <strong>Is Hot:</strong> {movie.movie.isHot ? "Hot" : "Not Hot"}
      </p>
    </div>
  );
};

export default MovieDetailAd;
