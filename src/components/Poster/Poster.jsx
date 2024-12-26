import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "./Poster.css";
import { Link } from "react-router-dom";

const Poster = () => {
  const [movies, setMovies] = useState([]);
  const MOVIE = import.meta.env.VITE_MOVIE;
  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `${MOVIE}/api/movies?OrderBy=-CreatedDate&PageNumber=1&PageSize=3`
      );
      const data = await response.json();
      console.log("API Response:", data);

      if (data.isSuccess && Array.isArray(data.result)) {
        setMovies(data.result);
      } else {
        console.error(
          "Failed to fetch movies or invalid data structure:",
          data
        );
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <section className="hero">
      <div className="container">
        <OwlCarousel
          className="hero__slider owl-theme"
          items={1}
          loop
          nav
          autoplay
          margin={10}
          navText={[
            `<div class="custom-nav left-nav"><i class="fa fa-angle-left"></i></div>`,
            `<div class="custom-nav right-nav"><i class="fa fa-angle-right"></i></div>`,
          ]}>
          {movies.map((item, index) => (
            <div
              className="hero__items1 set-bg"
              style={{
                backgroundImage: `url(${item.movie.imageUrl})`,
                width: "1296px",
                height: "600px",
                objectFit: "fill",
              }}
              key={index}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="hero__text1">
                    <div className="label">{item.category.name}</div>
                    <h2 className="h2-title">{item.movie.name}</h2>
                    <Link
                      className="ah"
                      to={`/detail-watching/${item.movie.movieId}`}>
                      <span>Watch Now</span>
                      <i className="fa fa-angle-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </OwlCarousel>
      </div>
    </section>
  );
};

export default Poster;
