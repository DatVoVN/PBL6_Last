import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResult.css";
import ProductItem from "../../components/ProductItem/ProductItem";
import NoMovieComponent from "../../components/NoMovieComponent/NoMovieComponent";
import Pagination from "../../components/Pagination/Pagination";
const MOVIE = import.meta.env.VITE_MOVIE;
const normalizeString = (str) => {
  if (!str) return ""; // Return empty string if str is undefined or null
  return str
    .normalize("NFD") // Normalize Unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase(); // Convert to lowercase
};

const SearchResults = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${MOVIE}/api/movies?PageNumber=1&PageSize=2000`
        );
        const data = await response.json();

        setMovies(data.result);
        setFilteredMovies(data.result); // Initialize filteredMovies with fetched data
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get("query");
    if (searchQuery) {
      setQuery(searchQuery);
      filterMovies(searchQuery);
    }
  }, [location, movies]);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const filterMovies = (searchQuery) => {
    const normalizedQuery = normalizeString(searchQuery);

    const filtered = movies.filter((movie) => {
      if (!movie.movie.name) return false;

      const normalizedMovieName = normalizeString(movie.movie.name);
      // Check if the movie name starts with the search query
      return normalizedMovieName.startsWith(normalizedQuery);
    });

    setFilteredMovies(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}`);
    filterMovies(query); // Update filteredMovies after search
  };

  return (
    <div
      className="search-results-container"
      style={{ backgroundColor: "#070720", width: "100%", height: "auto" }}>
      {filteredMovies.length > 0 ? (
        <div className="movies-list">
          {filteredMovies.map((movie) => (
            <ProductItem
              key={movie.movieId}
              movie={movie}
              width="320px"
              height="400px"
            />
          ))}
        </div>
      ) : (
        <NoMovieComponent />
      )}
    </div>
  );
};

export default SearchResults;
