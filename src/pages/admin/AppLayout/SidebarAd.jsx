import React from "react";
import {
  BsCart3,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsGrid1X2Fill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsPeopleFill,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
function SidebarAd() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      Cookies.remove("authToken");
      navigate("/login");
    }
  };
  return (
    <aside id="sidebar">
      <div className="sidebar-title">
        <div className="sidebar-brand">ADMIN</div>
        <span className="icon close_icon"></span>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link className="href" to="/admin/home">
            <BsGrid1X2Fill className="icon" />
            Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link className="href" to="/admin/movies">
            <BsFillArchiveFill className="icon" />
            Movies
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link className="href" to="/admin/categories">
            <BsFillGrid3X3GapFill className="icon" />
            Categories
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link className="href" to="/admin/user">
            <BsPeopleFill className="icon" />
            Users
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link className="href" to="/admin/countries">
            <BsListCheck className="icon" />
            Countries
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link className="href" to="/admin/genre">
            <BsMenuButtonWideFill className="icon" />
            Genre
          </Link>
        </li>
        <li className="sidebar-list-item">
          <button
            className="href"
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: "-15px",
            }}>
            <BsMenuButtonWideFill className="icon" />
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default SidebarAd;
