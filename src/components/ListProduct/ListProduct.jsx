import React, { useEffect, useState } from "react";
import ProductItem from "../ProductItem/ProductItem";
import "./ListProduct.css";
import MoviesByYear from "../MovieByYear/MovieByYear";
import { Link } from "react-router-dom";

const ListProduct = () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const response = await fetch("https://localhost:7001/api/movies");
      const data = await response.json();
      if (data.isSuccess) {
        const sortedMovies = data.result.sort(
          (a, b) => new Date(b.updatedDate) - new Date(a.updatedDate)
        );
        setMovies(sortedMovies.slice(0, 8));
      } else {
        console.error("Failed to fetch movies:", data.message);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="trending__product">
      <div className="row">
        <div className="col-lg-8 col-md-8 col-sm-8">
          <div className="section-title">
            <h5>PHIM MỚI NHẤT</h5>
          </div>
        </div>
      </div>
      <div className="row">
        {movies.map((movie) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={movie.movieId}>
            <ProductItem movie={movie} width="auto" height="400px" />
          </div>
        ))}
      </div>
      <MoviesByYear />
    </div>
  );
};

export default ListProduct;
