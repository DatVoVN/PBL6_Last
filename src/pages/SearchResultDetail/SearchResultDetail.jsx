import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductItem from "../../components/ProductItem/ProductItem";
import NoMovieComponent from "../../components/NoMovieComponent/NoMovieComponent";
import Pagination from "../../components/Pagination/Pagination";
import Spinner from "../../components/Spinner/Spinner";

const SearchResultDetail = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResultsAll || [];
  console.log("searcRessults", searchResults);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const itemsPerPage = 25;
  const MOVIE = import.meta.env.VITE_MOVIE;

  const fetchMoviesByCountry = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${MOVIE}/api/movies?Name=${searchResults}&PageNumber=${pageNumber}&PageSize=${itemsPerPage}`
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
  }, [searchResults, pagination.currentPage]);

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
        PHIM VỚI KẾT QUẢ TÌM KIẾM:{" "}
        <span
          style={{
            color: "red",
            WebkitTextFillColor: "purple",
            marginLeft: "10px",
          }}>
          {searchResults}
        </span>
      </h4>
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
export default SearchResultDetail;
