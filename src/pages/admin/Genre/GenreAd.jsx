import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GenreAd.css";
import Cookies from "js-cookie";

const GenreAd = () => {
  const [genre, setGenre] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {
    fetchGenre();
  }, []);

  const fetchGenre = async () => {
    try {
      const response = await fetch("https://cineworld.io.vn:7001/api/genres");
      const data = await response.json();
      if (data.isSuccess) {
        setGenre(data.result);
      } else {
        console.error("Failed to fetch genre:", data.message);
      }
    } catch (error) {
      console.error("Error fetching genre:", error);
    }
  };

  const handleDelete = async (genreId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa genre này?")) {
      try {
        const response = await fetch(
          `https://cineworld.io.vn:7001/api/genres/?id=${genreId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          alert("Xóa genre không thành công: " + errorText);
          return;
        }

        if (response.status !== 204) {
          const data = await response.json();
          if (data.isSuccess) {
            fetchGenre();
            alert("Xóa genre thành công!");
          } else {
            alert("Xóa genre không thành công: " + data.message);
          }
        } else {
          fetchGenre();
          alert("Xóa genre thành công!");
        }
      } catch (error) {
        console.error("Error deleting genre:", error);
        alert("Lỗi khi xóa genre: " + error.message);
      }
    }
  };

  const handleUpdate = (genreId) => {
    navigate(`/admin/updategenre/${genreId}`);
  };

  const handleViewMovies = (genreId) => {
    navigate(`/admin/genre/${genreId}/movies`);
  };

  // Phân trang
  const totalPages = Math.ceil(genre.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGenre = genre.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="categories-container">
      <button
        className="add-button"
        onClick={() => navigate("/admin/addgenre")}>
        Thêm Genre
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentGenre.map((genre) => (
            <tr key={genre.categoryId}>
              <td>{genre.genreId}</td>
              <td>{genre.name}</td>
              <td>{genre.status ? "Kích hoạt" : "Không kích hoạt"}</td>
              <td>
                <button onClick={() => handleUpdate(genre.genreId)}>
                  Cập nhật
                </button>
                <button onClick={() => handleDelete(genre.genreId)}>Xóa</button>
                <button onClick={() => handleViewMovies(genre.genreId)}>
                  Xem phim
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreAd;
