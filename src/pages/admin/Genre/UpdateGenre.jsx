import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./UpdateGenre.css";
const UpdateGenre = () => {
  const { id } = useParams();
  const [genre, setGenre] = useState({
    name: "",
    slug: "",
    status: true,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenre();
  }, []);

  const fetchGenre = async () => {
    try {
      const response = await fetch(
        `https://cineworld.io.vn:7001/api/genre/${id}`
      );
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenre({ ...genre, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://cineworld.io.vn:7001/api/genres/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
          body: JSON.stringify(genre),
        }
      );
      const data = await response.json();
      if (data.isSuccess) {
        setMessage("Cập nhật genre thành công!");
        navigate("/admin/genre");
      } else {
        setMessage("Cập nhật genre không thành công: " + data.message);
      }
    } catch (error) {
      setMessage("Lỗi: " + error.message);
    }
  };

  return (
    <div className="update-category-container">
      <h1>Cập nhật Genre</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên Genre:</label>
          <input
            type="text"
            name="name"
            value={genre.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Slug:</label>
          <input
            type="text"
            name="slug"
            value={genre.slug}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Trạng thái:</label>
          <select name="status" value={genre.status} onChange={handleChange}>
            <option value={true}>Kích hoạt</option>
            <option value={false}>Không kích hoạt</option>
          </select>
        </div>
        <button type="submit">Cập nhật Genre</button>
      </form>
    </div>
  );
};

export default UpdateGenre;
