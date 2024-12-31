import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductItem from "../../components/ProductItem/ProductItem";
import Pagination from "../../components/Pagination/Pagination";
import "./CategoryPage.css";
import Spinner from "../../components/Spinner/Spinner";
import NoMovieComponent from "../../components/NoMovieComponent/NoMovieComponent";
const MOVIE = import.meta.env.VITE_MOVIE;

const CategoryPage = () => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItemsPerPage: 25,
    totalItems: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [country, setCountry] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [categoryName, setCategoryName] = useState(""); // State for category name

  const fetchAllMovies = async () => {
    setIsLoading(true);
    setLoading(true);
    try {
      const response = await fetch(
        `${MOVIE}/api/movies?CategoryId=${id}&PageNumber=1&PageSize=20000`
      );
      const data = await response.json();
      setMovies(data.result);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalItemsPerPage: data.pagination.totalItemsPerPage,
        totalItems: data.pagination.totalItems,
      });

      const uniqueCountries = [
        ...new Set(data.result.map((movie) => movie.country.name)),
      ];
      setCountries(uniqueCountries);

      const uniqueYears = [
        ...new Set(data.result.map((movie) => movie.movie.year)),
      ];
      const sortedYears = uniqueYears.sort((a, b) => b - a);
      setYears(sortedYears);

      const uniqueGenres = [
        ...new Set(
          data.result.flatMap((movie) =>
            movie.genres.map((genre) => genre.name)
          )
        ),
      ];
      setGenres(uniqueGenres);

      // Fetching category name
      if (data.result.length > 0) {
        setCategoryName(data.result[0].category.name); // Assuming the category name is available in the response
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllMovies();
  }, [id]);

  const handlePageChange = (page) => {
    fetchMovies(page, orderBy, country, genre, year);
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value); // Update the year filter
  };

  const handleSearch = () => {
    fetchMovies(1, orderBy, country, genre, year);
  };

  const handleReset = () => {
    setOrderBy("");
    setCountry("");
    setGenre("");
    setYear("");
    fetchAllMovies();
  };

  const fetchMovies = async (
    pageNumber = 1,
    orderBy = "",
    country = "",
    genre = "",
    year = ""
  ) => {
    setIsLoading(true);
    setLoading(true);
    try {
      const response = await fetch(
        `${MOVIE}/api/movies?CategoryId=${id}&PageNumber=${pageNumber}&PageSize=25&OrderBy=${orderBy}&Country=${country}&Genre=${genre}&Year=${year}` // Make sure `year` is included in the query
      );
      const data = await response.json();
      console.log(
        `${MOVIE}/api/movies?CategoryId=${id}&PageNumber=${pageNumber}&PageSize=25&OrderBy=${orderBy}&Country=${country}&Genre=${genre}&Year=${year}`
      );

      setMovies(data.result);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalItemsPerPage: data.pagination.totalItemsPerPage,
        totalItems: data.pagination.totalItems,
      });
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }
  console.log(movies);

  return (
    <div className="categorypage">
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
        TRANG PHIM CỦA DANH MỤC: {""}
        <span
          style={{
            color: "red",
            WebkitTextFillColor: "purple",
            marginLeft: "10px",
          }}>
          {categoryName}
        </span>
      </h4>{" "}
      {/* Display category name */}
      <div className="filter-section">
        <select
          className="filter-dropdown1"
          value={orderBy}
          onChange={handleOrderChange}>
          <option value="">Thời gian</option>
          <option value="-CreatedDate">Mới nhất</option>
          <option value="+CreatedDate">Cũ nhất</option>
        </select>
        <select
          className="filter-dropdown1"
          value={country}
          onChange={handleCountryChange}>
          <option value="">Quốc gia</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          className="filter-dropdown1"
          value={genre}
          onChange={handleGenreChange}>
          <option value="">Thể loại</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <select
          className="filter-dropdown1"
          value={year}
          onChange={handleYearChange}>
          <option value="">Năm</option>
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button className="search-button1" onClick={handleSearch}>
          🔍 Duyệt
        </button>
        <button className="reset-button1" onClick={handleReset}>
          🔄 Toàn bộ phim
        </button>
      </div>
      <div className="movies-list">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <ProductItem
              key={movie.movieId}
              movie={movie}
              width="280px"
              height="400px"
            />
          ))
        ) : (
          <NoMovieComponent />
        )}
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
