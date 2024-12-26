import React, { useEffect, useState } from "react";
import ProductItem from "../ProductItem/ProductItem";
import "./ListProduct.css";
import MoviesByYear from "../MovieByYear/MovieByYear";
import { Link } from "react-router-dom";

const ListProduct = () => {
  const [movies, setMovies] = useState([]);
  const MOVIE = import.meta.env.VITE_MOVIE;
  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `${MOVIE}/api/movies?OrderBy=-CreatedDate&PageNumber=1&PageSize=8`
      );
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

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="trending__product">
      <div className="row">
        <div className="col-lg-8 col-md-8 col-sm-8">
          <div className="section-title" style={{ marginBottom: "0px" }}>
            <h5>PHIM MỚI NHẤT</h5>
          </div>
        </div>
      </div>
      <div className="row">
        {movies.map((movie) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={movie.movieId}>
            <ProductItem movie={movie} width="auto" height="450px" />
          </div>
        ))}
      </div>
      <MoviesByYear />
    </div>
  );
};

export default ListProduct;
