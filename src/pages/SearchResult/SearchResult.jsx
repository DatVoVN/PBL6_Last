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
        const response = await fetch("https://localhost:7001/api/movies");
        const data = await response.json();

        // Log each movie's name from the fetched data
        data.result.forEach((movie) => {
          console.log("Fetched Movie Name:", movie.movie.name); // Log movie name
        });

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
  }, [location]);

  const filterMovies = (searchQuery) => {
    const normalizedQuery = normalizeString(searchQuery);
    console.log("Normalized Query:", normalizedQuery);

    const filtered = movies.filter((movie) => {
      if (!movie.movie.name) return false;

      const normalizedMovieName = normalizeString(movie.movie.name);
      console.log(`Normalized Movie Name: "${normalizedMovieName}"`);
      return normalizedMovieName.includes(normalizedQuery);
    });

    console.log("Filtered Movies:", filtered);
    setFilteredMovies(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div>
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
        <p>No movies found.</p>
      )}
    </div>
  );
};

export default SearchResults;
