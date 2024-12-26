import React, { useEffect, useState } from "react";
import "./Header.css";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [oddCategories, setOddCategories] = useState([]);
  const [oddCountries, setOddCountries] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [userName, setUserName] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Add a state for search results
  const navigate = useNavigate();
  const location = useLocation();
  const MOVIE = import.meta.env.VITE_MOVIE;
  const REACTION = import.meta.env.VITE_REACTION;

  useEffect(() => {
    const token = Cookies.get("authToken");
    setIsLoggedIn(!!token);

    if (token) {
      const name = Cookies.get("fullName");
      setUserName(name || "");
    }
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${MOVIE}/api/categories?PageNumber=1&PageSize=100`
        );
        const data = await response.json();
        if (Array.isArray(data.result)) {
          const filteredCategories = data.result.filter(
            (category) => category.name !== "Phim Bộ 23232"
          );
          setOddCategories(filteredCategories);
        } else {
          console.error("Dữ liệu không phải là một mảng:", data.result);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `${MOVIE}/api/countries?PageNumber=1&PageSize=1000`
        );
        const data = await response.json();
        if (Array.isArray(data.result)) {
          const filteredCountries = data.result.filter(
            (country) => country.name !== "Phim Bộ 23232"
          );
          setOddCountries(filteredCountries);
        } else {
          console.error("Dữ liệu không phải là một mảng:", data.result);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${MOVIE}/api/movies?PageNumber=1&PageSize=2000`
        );
        const data = await response.json();
        if (Array.isArray(data.result)) {
          const categoriesWithMovies = new Set(
            data.result.map((movie) => movie.movie.categoryId)
          );

          const countriesWithMovies = new Set(
            data.result.map((movie) => movie.movie.countryId)
          );

          const filteredAvailableCategories = oddCategories.filter((category) =>
            categoriesWithMovies.has(category.categoryId)
          );

          const filteredAvailableCountries = oddCountries.filter((country) =>
            countriesWithMovies.has(country.countryId)
          );

          setAvailableCategories(filteredAvailableCategories);
          setAvailableCountries(filteredAvailableCountries);
        } else {
          console.error("Dữ liệu không phải là một mảng:", data.result);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, [oddCategories, oddCountries]);

  // Fetch movies based on the search query
  useEffect(() => {
    const fetchMoviesBySearchQuery = async () => {
      if (searchQuery.trim() !== "") {
        try {
          const response = await fetch(
            `${MOVIE}/api/movies?Name=${searchQuery}&PageNumber=1&PageSize=25`
          );
          const data = await response.json();
          if (Array.isArray(data.result)) {
            setSearchResults(data.result); // Update search results state
          } else {
            console.error("Dữ liệu không phải là một mảng:", data.result);
            setSearchResults([]); // Clear the results if not valid
          }
        } catch (error) {
          console.error("Failed to fetch movies:", error);
          setSearchResults([]); // Clear the results in case of error
        }
      } else {
        setSearchResults([]); // Clear results if the search query is empty
      }
    };

    fetchMoviesBySearchQuery();
  }, [searchQuery]);

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("userName"); // Remove userName from cookies
    setIsLoggedIn(false);
    setUserName(""); // Clear the userName state on logout
    navigate("/login");
  };

  const toggleProfileMenu = () => {
    setProfileMenuVisible(!isProfileMenuVisible);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(
      `/api/movies?Name=${encodeURIComponent(
        searchQuery
      )}&PageNumber=1&PageSize=25`
    );
  };

  if (location.pathname === "/login") {
    return null;
  }
  console.log(availableCategories);
  console.log(availableCountries);

  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-lg-2" style={{}}>
            <div className="header__logo">
              <a href="./index.html">
                <img src="/public/img/logo1.jpg" alt="Logo" />
              </a>
            </div>
          </div>
          <div className="col-lg-6" style={{ width: "150%" }}>
            <div className="header__nav">
              <nav className="header__menu mobile-menu">
                <ul>
                  <li>
                    <Link to={"/"}>Homepage</Link>
                  </li>
                  <li>
                    <a href="#">
                      Categories <span className="arrow_carrot-down"></span>
                    </a>
                    <ul className="dropdown">
                      {availableCategories.length > 0 ? (
                        availableCategories.map((category) => (
                          <li key={category.categoryId}>
                            <Link to={`/category/${category.categoryId}`}>
                              {category.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>No categories found</li>
                      )}
                    </ul>
                  </li>
                  <li>
                    <a href="#">
                      Country <span className="arrow_carrot-down"></span>
                    </a>
                    <ul className="dropdown">
                      {availableCountries.length > 0 ? (
                        availableCountries.map((country) => (
                          <li key={country.countryId}>
                            <Link to={`/country/${country.countryId}`}>
                              {country.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>No country found</li>
                      )}
                    </ul>
                  </li>
                  <li>
                    <Link to="/membership">Membership</Link>
                  </li>
                  <li>
                    <Link to="/history">Watch History</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="col-lg-3 custom-style">
            <div className="header__right">
              <form
                onSubmit={handleSearchSubmit}
                className="search-form"
                style={{
                  paddingTop: "10px",
                  marginRight: "5px",
                }}>
                <input
                  style={{ borderRadius: "10px" }}
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <button
                  type="submit"
                  className="search-button"
                  style={{ paddingTop: "8px" }}>
                  <span className="icon_search" style={{ paddingTop: "15px" }}>
                    <i className="bi bi-search"></i>
                  </span>
                </button>
              </form>

              {/* Show search results below the search input */}
              {searchResults.length > 0 && (
                <div className="search-results">
                  <ul>
                    {searchResults.slice(0, 5).map((movie) => (
                      <li key={movie.movie.movieId}>
                        <Link to={`/detail-watching/${movie.movie.movieId}`}>
                          <img
                            src={movie.movie.imageUrl}
                            alt={movie.movie.name}
                            width="50"
                            height="75"
                          />
                          {movie.movie.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isLoggedIn ? (
                <div
                  className="profile-btn"
                  onClick={toggleProfileMenu}
                  style={{
                    display: "flex",
                    width: "70%",
                  }}>
                  <i
                    className="bi bi-person-circle"
                    style={{ marginRight: "20px" }}></i>
                  {userName && <span>{userName}</span>}
                  {isProfileMenuVisible && (
                    <div className="profile-menu">
                      <ul>
                        <li>
                          <Link className="change" to="/profile">
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <Link className="change" to="/change-password">
                            Change Password
                          </Link>
                        </li>
                        <li>
                          <Link className="change" to="/receipt">
                            Receipt
                          </Link>
                        </li>
                        <li>
                          <Link className="change" to="/favorites">
                            My Favorites
                          </Link>
                        </li>
                        <li>
                          <button onClick={handleLogout}>Logout</button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="login-btn">
                  <span className="icon_profile">
                    <i className="bi bi-person-circle"></i>
                  </span>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
