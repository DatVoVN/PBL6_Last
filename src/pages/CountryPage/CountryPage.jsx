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
  const [countryName, setCountryName] = useState("");

  const itemsPerPage = 25;
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

  const fetchCountryName = async () => {
    try {
      const response = await fetch(`${MOVIE}/api/countries/${id}`);
      const data = await response.json();
      if (data.result && data.result.name) {
        setCountryName(data.result.name); // Access name from result
      } else {
        setCountryName("Country not found"); // Fallback if no name exists
      }
    } catch (error) {
      console.error("Failed to fetch country name:", error);
      setCountryName("Error fetching country name"); // Fallback on error
    }
  };

  useEffect(() => {
    fetchMoviesByCountry(pagination.currentPage);
    fetchCountryName(); // Fetch country name when component mounts
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
      <h4
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
          color: "#1fc3f9",
          background: "linear-gradient(to right, #b721ff,#21d4fd)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}>
        TRANG PHIM CỦA QUỐC GIA:{" "}
        <span
          style={{
            color: "red",
            WebkitTextFillColor: "purple",
            marginLeft: "10px",
          }}>
          {countryName}
        </span>
      </h4>

      <div className="movies-list">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <ProductItem
              key={movie.movieId}
              movie={movie}
              width="280px"
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
