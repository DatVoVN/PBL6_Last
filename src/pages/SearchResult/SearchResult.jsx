import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResult.css";
import ProductItem from "../../components/ProductItem/ProductItem";

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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("https://cineworld.io.vn:7001/api/movies");
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
    <div className="search-results-container">
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
        <p className="no-results">No movies found.</p>
      )}
    </div>
  );
};

export default SearchResults;
