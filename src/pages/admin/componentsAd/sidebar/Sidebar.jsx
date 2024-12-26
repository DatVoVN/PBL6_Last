import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../contextAd/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import {
  MdOutlineAttachMoney,
  MdOutlineBarChart,
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineMessage,
  MdOutlinePeople,
  MdOutlineSettings,
  MdOutlineShoppingBag,
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Sidebar.scss";
import { SidebarContext } from "../../contextAd/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear the user data from localStorage/sessionStorage or cookies
    localStorage.removeItem("userToken"); // Example: remove token from localStorage
    sessionStorage.removeItem("userToken"); // Example: remove token from sessionStorage

    // Optionally, you can also clear other user-related data if stored

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="" />
          <span className="sidebar-brand-text">tabernam.</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }>
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }>
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={20} />
                </span>
                <span className="menu-link-text">Categories</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/admin/country"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }>
                <span className="menu-link-icon">
                  <MdOutlineAttachMoney size={20} />
                </span>
                <span className="menu-link-text">Country</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/admin/genres"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }>
                <span className="menu-link-icon">
                  <MdOutlineCurrencyExchange size={18} />
                </span>
                <span className="menu-link-text">Genres</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/admin/movies"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }>
                <span className="menu-link-icon">
                  <MdOutlineShoppingBag size={20} />
                </span>
                <span className="menu-link-text">Movies</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/admin/episodes"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }>
                <span className="menu-link-icon">
                  <MdOutlineShoppingBag size={20} />
                </span>
                <span className="menu-link-text">Episodes</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }>
                <span className="menu-link-icon">
                  <MdOutlinePeople size={20} />
                </span>
                <span className="menu-link-text">Users</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/admin/packages"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }>
                <span className="menu-link-icon">
                  <MdOutlineMessage size={18} />
                </span>
                <span className="menu-link-text">Packages</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }>
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Settings</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <button className="menu-link" onClick={handleLogout}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
