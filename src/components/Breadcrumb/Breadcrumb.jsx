import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const { id } = useParams(); // Lấy tham số id từ URL nếu có

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/");
      // Xử lý cho các route đặc biệt có tham số (ví dụ: category, movie, v.v)
      if (segment === "category" && id) {
        return { name: `Danh mục: ${id}`, path };
      } else if (segment === "movie-watching" && id) {
        return { name: `Xem phim: ${id}`, path };
      } else if (segment === "detail-watching" && id) {
        return { name: `Chi tiết phim: ${id}`, path };
      } else {
        // Các breadcrumb mặc định cho các route
        return {
          name: segment.charAt(0).toUpperCase() + segment.slice(1),
          path,
        };
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const breadcrumbStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#007bff",
  };

  const listStyle = {
    display: "inline",
    margin: "0 5px",
    listStyleType: "none",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#007bff",
  };

  const separatorStyle = {
    margin: "0 5px",
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb" style={breadcrumbStyle}>
        <li className="breadcrumb-item" style={listStyle}>
          <Link to="/" style={linkStyle}>
            Home
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="breadcrumb-item" style={listStyle}>
            <span style={separatorStyle}>/</span>
            <Link to={breadcrumb.path} style={linkStyle}>
              {breadcrumb.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
