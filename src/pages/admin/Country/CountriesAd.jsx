import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CountriesAd.css";
import Cookies from "js-cookie";

const CountriesAd = () => {
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        "https://cineworld.io.vn:7001/api/countries"
      );
      const data = await response.json();
      if (data.isSuccess) {
        setCountries(data.result);
      } else {
        console.error("Failed to fetch countries:", data.message);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const handleDelete = async (countryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa country này?")) {
      try {
        const response = await fetch(
          `https://localhost:7001/api/countries/?id=${countryId}`,
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
          alert("Xóa country không thành công: " + errorText);
          return;
        }

        if (response.status !== 204) {
          const data = await response.json();
          if (data.isSuccess) {
            fetchCountries();
            alert("Xóa country thành công!");
          } else {
            alert("Xóa country không thành công: " + data.message);
          }
        } else {
          fetchCountries();
          alert("Xóa country thành công!");
        }
      } catch (error) {
        console.error("Error deleting country:", error);
        alert("Lỗi khi xóa country: " + error.message);
      }
    }
  };

  const handleUpdate = (countryId) => {
    navigate(`/admin/updatecountry/${countryId}`);
  };

  const handleViewMovies = (countryId) => {
    navigate(`/admin/countries/${countryId}/movies`);
  };

  // Phân trang
  const totalPages = Math.ceil(countries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCountries = countries.slice(
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
        onClick={() => navigate("/admin/addcountries")}>
        Thêm Country
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
          {currentCountries.map((country) => (
            <tr key={country.countryId}>
              <td>{country.countryId}</td>
              <td>{country.name}</td>
              <td>{country.status ? "Kích hoạt" : "Không kích hoạt"}</td>
              <td>
                <button onClick={() => handleUpdate(country.countryId)}>
                  Cập nhật
                </button>
                <button onClick={() => handleDelete(country.countryId)}>
                  Xóa
                </button>
                <button onClick={() => handleViewMovies(country.countryId)}>
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

export default CountriesAd;
