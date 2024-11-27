import React, { useEffect, useState, useRef } from "react";
import "./MovieByYear.css";
import MovieItemYear from "../MovieItemYear/MovieItemYear";

const MovieByYear = () => {
  const [movies, setMovies] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const movieListRef = useRef(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  const filteredMovies = selectedYear
    ? movies.filter((movie) => movie.movie.year === selectedYear)
    : movies;

  useEffect(() => {
    fetchMovies();
  }, []);
  const handleMouseDown = (e) => {
    isMouseDown.current = true;
    startX.current = e.pageX - movieListRef.current.offsetLeft;
    scrollLeft.current = movieListRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isMouseDown.current = false;
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown.current) return;
    e.preventDefault();
    const x = e.pageX - movieListRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    movieListRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const scrollLeftHandler = () => {
    movieListRef.current.scrollLeft -= movieListRef.current.clientWidth / 2;
  };

  const scrollRightHandler = () => {
    movieListRef.current.scrollLeft += movieListRef.current.clientWidth / 2;
  };

  return (
    <div className="yearly-movies">
      <div className="section-title">
        <h5>PHIM THEO NĂM</h5>
      </div>
      <div className="year-selector">
        {[2018, 2019, 2020, 2021, 2022, 2023, 2024].map((year) => (
          <button
            key={year}
            onClick={() => handleYearSelect(year)}
            className={`year-btn ${selectedYear === year ? "active" : ""}`}>
            {" "}
            {year}
          </button>
        ))}
      </div>
      <div className="scroll-buttons">
        <button onClick={scrollLeftHandler} className="scroll-btn left-btn">
          {"<"}
        </button>
        <div
          className="movie-list"
          ref={movieListRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ cursor: isMouseDown.current ? "grabbing" : "grab" }}>
          {filteredMovies.map((movie) => (
            <div className="movie-item" key={movie.movieId}>
              <MovieItemYear movie={movie} />
            </div>
          ))}
        </div>
        <button onClick={scrollRightHandler} className="scroll-btn right-btn">
          {">"}
        </button>
      </div>
    </div>
  );
};

export default MovieByYear;
