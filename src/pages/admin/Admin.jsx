import { useContext, useEffect } from "react";
import "./Admin.scss";
import { Routes, Route } from "react-router-dom"; // Chỉ cần Routes và Route
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import { ThemeContext } from "./contextAd/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import Categories from "./componentsAd/categories/Categories";
import Country from "./componentsAd/country/Country";
import Genre from "./componentsAd/genre/Genre";
import User from "./componentsAd/user/User";
import Movies from "./componentsAd/movies/Movies";
import Packages from "./componentsAd/packages/Packages";
import Episodes from "./componentsAd/episodes/Episodes";

function Admin() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/country" element={<Country />} />
          <Route path="/genres" element={<Genre />} />
          <Route path="/users" element={<User />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/episodes" element={<Episodes />} />
        </Route>
      </Routes>

      <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
        <img
          className="theme-icon"
          src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          alt="Toggle Theme"
        />
      </button>
    </>
  );
}

export default Admin;
