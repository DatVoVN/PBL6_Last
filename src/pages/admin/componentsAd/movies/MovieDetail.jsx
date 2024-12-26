import React from "react";
import "./MovieDetail.css";

const MovieDetail = ({ movie }) => {
  if (!movie) {
    return <div className="movie-detail-container">Movie not found!</div>;
  }

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-card">
        <div className="movie-image">
          <img src={movie.imageUrl} alt={movie.name} />
        </div>
        <div className="movie-details">
          <h2>{movie.name}</h2>
          <p>
            <strong>Original Name:</strong> {movie.originName}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {movie.description.replace(/&quot;/g, '"')}
          </p>
          <p>
            <strong>Category:</strong> {movie.categoryName}
          </p>
          <p>
            <strong>Country:</strong> {movie.countryName}
          </p>
          <p>
            <strong>Genres:</strong>
            <span className="genres">
              {movie.genres?.length > 0
                ? movie.genres.map((genre) => (
                    <span key={genre.name}>{genre.name}</span>
                  ))
                : "N/A"}
            </span>
          </p>
          <p>
            <strong>Year:</strong> {movie.year}
          </p>
          <p>
            <strong>Status:</strong> {movie.status ? "Active" : "Inactive"}
          </p>
          <p>
            <strong>Duration:</strong> {movie.duration}
          </p>
          <p>
            <strong>Views:</strong> {movie.view}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
