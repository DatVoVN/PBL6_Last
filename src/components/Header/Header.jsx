import React, { useEffect, useState } from "react";
import "./Header.css";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [oddCategories, setOddCategories] = useState([]);
  const [oddCountries, setOddCountries] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]); // New state for categories with movies
  const [availableCountries, setAvailableCountries] = useState([]); // New state for countries with movies
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get("authToken");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://localhost:7001/api/categories");
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
        const response = await fetch("https://localhost:7001/api/countries");
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
        const response = await fetch("https://localhost:7001/api/movies");
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

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  if (location.pathname === "/login") {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-lg-2">
            <div className="header__logo">
              <a href="./index.html">
                <img src="./img/logo.png" alt="Logo" />
              </a>
            </div>
          </div>
          <div className="col-lg-6">
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
                </ul>
              </nav>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="header__right">
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <button type="submit" className="search-button">
                  <span className="icon_search">
                    <i className="bi bi-search"></i>
                  </span>
                </button>
              </form>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="logout-btn">
                  <span className="icon_profile">
                    <i className="bi bi-box-arrow-right"></i>
                  </span>
                  Logout
                </button>
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
