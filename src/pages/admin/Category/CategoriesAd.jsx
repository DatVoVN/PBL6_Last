import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriesAd.css";
import Cookies from "js-cookie";

const CategoriesAd = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://cineworld.io.vn:7001/api/categories"
      );
      const data = await response.json();
      if (data.isSuccess) {
        setCategories(data.result);
      } else {
        console.error("Failed to fetch categories:", data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa category này?")) {
      try {
        const response = await fetch(
          `https://cineworld.io.vn:7001/api/categories/?id=${categoryId}`,
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
          alert("Xóa category không thành công: " + errorText);
          return;
        }

        if (response.status !== 204) {
          const data = await response.json();
          if (data.isSuccess) {
            fetchCategories();
            alert("Xóa category thành công!");
          } else {
            alert("Xóa category không thành công: " + data.message);
          }
        } else {
          fetchCategories();
          alert("Xóa category thành công!");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Lỗi khi xóa category: " + error.message);
      }
    }
  };

  const handleUpdate = (categoryId) => {
    navigate(`/admin/updatecategory/${categoryId}`);
  };

  const handleViewMovies = (categoryId) => {
    navigate(`/admin/categories/${categoryId}/movies`);
  };

  // Phân trang
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = categories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="categories-container">
      <button
        className="add-button"
        onClick={() => navigate("/admin/addcategories")}>
        Thêm Category
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
          {currentCategories.map((category) => (
            <tr key={category.categoryId}>
              <td>{category.categoryId}</td>
              <td>{category.name}</td>
              <td>{category.status ? "Kích hoạt" : "Không kích hoạt"}</td>
              <td>
                <button onClick={() => handleUpdate(category.categoryId)}>
                  Cập nhật
                </button>
                <button onClick={() => handleDelete(category.categoryId)}>
                  Xóa
                </button>
                <button onClick={() => handleViewMovies(category.categoryId)}>
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

export default CategoriesAd;
