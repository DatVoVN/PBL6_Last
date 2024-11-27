import React from "react";
import "./TopViewProduct.css";

const TopViewProduct = ({ movies }) => {
  return (
    <>
      {movies.map((movie) => (
        <div
          className="product__sidebar__view__item set-bg"
          style={{
            backgroundImage: `url(${movie.movie.imageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
          key={movie.movieId}>
          <div className="ep">
            {movie.movie.episodeCurrent} / {movie.movie.episodeTotal || "?"}
          </div>
          <div className="view">
            <i className="fa fa-eye"></i> {movie.movie.view}
          </div>
          <h5>
            <a href={`/detail-watching/${movie.movie.movieId}`}>
              {movie.movie.name}
            </a>
          </h5>
        </div>
      ))}
    </>
  );
};

export default TopViewProduct;
