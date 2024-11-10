import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductItem from "../../components/ProductItem/ProductItem";
import Pagination from "../../components/Pagination/Pagination"; // Import the Pagination component
import "./CountryPage.css";
import BackButton from "../../components/BackButton/BackButton";

const CountryPage = () => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 6; // Set items per page as needed

  useEffect(() => {
    const fetchMoviesByCountry = async () => {
      try {
        const response = await fetch(
          `https://localhost:7001/api/movies?countryId=${id}`
        );
        const data = await response.json();
        setMovies(data.result || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByCountry();
  }, [id]);

  // Calculate current movies based on pagination
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="movies-list">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <ProductItem
              key={movie.movieId}
              movie={movie}
              width="320px"
              height="400px"
            />
          ))
        ) : (
          <p>No movies found in this country.</p>
        )}
      </div>

      <Pagination
        totalItems={movies.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CountryPage;
