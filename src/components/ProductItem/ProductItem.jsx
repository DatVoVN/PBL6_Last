// ProductItem.js
import React from "react";
import "./ProductItem.css";
import { Link } from "react-router-dom";

const ProductItem = ({ movie, width, height }) => {
  return (
    <Link
      to={`/detail-watching/${movie.movie.movieId}`}
      className="product__item-link">
      <div className="product__item" style={{ width: width, height: height }}>
        <div
          className="product__item__pic"
          style={{
            backgroundImage: `url(${
              movie?.movie?.imageUrl || "img/trending/trend-1.jpg"
            })`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top center",
            backgroundSize: "cover",
          }}>
          <div className="ep">
            {`${movie.movie.episodeCurrent} / ${
              movie.movie.episodeTotal !== null ? movie.movie.episodeTotal : "?"
            }`}
          </div>
          <div className="comment">
            <i className="fa fa-comments"></i> {movie.movie.commentCount || 0}
          </div>
          <div className="view">
            <i className="fa fa-eye"></i> {movie.movie.view || 0}
          </div>
        </div>
        <div className="product__item__text">
          <ul>
            {movie.genres.map((genre) => (
              <li key={genre.genreId}>{genre.name}</li>
            ))}
          </ul>
          <h5>
            <Link to={`/detail-watching/${movie.movie.movieId}`}>
              {movie.movie.name || "Default Movie Name"}
            </Link>
          </h5>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
