import React from "react";
import "./MovieItemYear.css";
import { Link } from "react-router-dom";
function MovieItemYear({ movie }) {
  return (
    <div
      className="hero__item"
      style={{
        backgroundImage: `url(${movie.movie.imageUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "300px",
      }}>
      <div className="hero__text">
        <div className="label">{movie.category.name}</div>
        <h2>{movie.movie.name}</h2>
        <Link to={`/detail-watching/${movie.movie.movieId}`}>
          <span>Watch Now</span>
        </Link>
      </div>
    </div>
  );
}

export default MovieItemYear;
