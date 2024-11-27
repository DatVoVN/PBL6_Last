import React, { useEffect, useState } from "react";
import "./HeroSlide.css";
import { Link } from "react-router-dom";

const HeroSlider = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchMovies = async () => {
    try {
      const response = await fetch("https://cineworld.io.vn:7001/api/movies");
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

  const hotMovies = movies.filter((movie) => movie.movie.isHot === false);
  const maxItems = 6;
  const circularMovies = [...hotMovies, ...hotMovies.slice(0, maxItems)];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % hotMovies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hotMovies]);

  const currentMovies = circularMovies.slice(
    currentIndex,
    currentIndex + maxItems
  );

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? hotMovies.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % hotMovies.length);
  };

  return (
    <div className="hero-container">
      <div className="section-title" style={{ paddingLeft: "110px" }}>
        <h5>PHIM HOT NHẤT</h5>
      </div>
      <div className="hero-grid">
        {currentMovies.map((movie, index) => (
          <div
            key={index}
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
        ))}
      </div>

      <div className="slider-controls">
        <div onClick={handlePrev} className="slider-button prev">
          <span className="arrow">&lt;</span>
        </div>
        <div onClick={handleNext} className="slider-button next">
          <span className="arrow">&gt;</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
