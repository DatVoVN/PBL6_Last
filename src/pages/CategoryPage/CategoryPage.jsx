import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductItem from "../../components/ProductItem/ProductItem";
import Pagination from "../../components/Pagination/Pagination"; // Import the Pagination component
import "./CategoryPage.css";

const CategoryPage = () => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);

  const [sortOrder, setSortOrder] = useState("Mới nhất");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 6; // Customize items per page

  useEffect(() => {
    const fetchMoviesByCategory = async () => {
      try {
        const response = await fetch(
          `https://localhost:7001/api/movies?categoryId=${id}`
        );
        const data = await response.json();
        const moviesData = data.result || [];
        setMovies(moviesData);
        setDisplayedMovies(moviesData);

        const uniqueCountries = Array.from(
          new Set(moviesData.map((movie) => movie.country?.name))
        ).filter(Boolean);
        setCountries(uniqueCountries);

        const uniqueGenres = Array.from(
          new Set(
            moviesData.flatMap((movie) =>
              movie.genres ? movie.genres.map((genre) => genre.name) : []
            )
          )
        ).filter(Boolean);
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByCategory();
  }, [id]);

  const applyFilters = () => {
    let filteredMovies = [...movies];

    if (selectedCountry) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.country?.name === selectedCountry
      );
    }
    if (selectedGenre) {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.genres?.some((genre) => genre.name === selectedGenre)
      );
    }
    if (selectedYear) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.movie.year === Number(selectedYear)
      );
    }

    filteredMovies.sort((a, b) => {
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);
      return sortOrder === "Mới nhất" ? dateB - dateA : dateA - dateB;
    });

    setDisplayedMovies(filteredMovies);
    setCurrentPage(1); // Reset to page 1 after applying filters
  };

  const resetFilters = () => {
    setSortOrder("Mới nhất");
    setSelectedCountry("");
    setSelectedGenre("");
    setSelectedYear("");
    setDisplayedMovies(movies);
    setCurrentPage(1); // Reset to page 1 after resetting filters
  };

  // Get the current page of movies based on pagination
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = displayedMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="categorypage">
      <div className="filter-section">
        <select
          className="filter-dropdown"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}>
          <option value="Mới nhất">Mới nhất</option>
          <option value="Cũ nhất">Cũ nhất</option>
        </select>
        <select
          className="filter-dropdown"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}>
          <option value="">Quốc gia</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          className="filter-dropdown"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">Thể loại</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <select
          className="filter-dropdown"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Năm</option>
          {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button className="search-button1" onClick={applyFilters}>
          🔍 Duyệt
        </button>
        <button className="reset-button" onClick={resetFilters}>
          🔄 Toàn bộ phim
        </button>
      </div>

      <div className="movies-list">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <ProductItem
              key={movie.movieId}
              movie={movie}
              width="290px"
              height="400px"
            />
          ))
        ) : (
          <p>No movies found in this category.</p>
        )}
      </div>

      <Pagination
        totalItems={displayedMovies.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CategoryPage;
