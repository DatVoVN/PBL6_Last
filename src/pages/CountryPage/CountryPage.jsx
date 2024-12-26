import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductItem from "../../components/ProductItem/ProductItem";
import Pagination from "../../components/Pagination/Pagination";
import "./CountryPage.css";
import Spinner from "../../components/Spinner/Spinner";
import NoMovieComponent from "../../components/NoMovieComponent/NoMovieComponent";

const CountryPage = () => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const itemsPerPage = 25; // From the API response
  const MOVIE = import.meta.env.VITE_MOVIE;

  const fetchMoviesByCountry = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${MOVIE}/api/movies?countryId=${id}&PageNumber=${pageNumber}&PageSize=${itemsPerPage}`
      );
      const data = await response.json();
      setMovies(data.result || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesByCountry(pagination.currentPage);
  }, [id, pagination.currentPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: pageNumber,
    }));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="countrypage">
      <div className="movies-list">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <ProductItem
              key={movie.movieId}
              movie={movie}
              width="250px"
              height="350px"
            />
          ))
        ) : (
          <NoMovieComponent />
        )}
      </div>
      <div className="pagination-container" style={{ marginBottom: "20px" }}>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CountryPage;
