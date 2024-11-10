import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./AddGenre.css";

const AddGenre = () => {
  const [newGenre, setNewGenre] = useState({
    name: "",
    slug: "",
    status: true,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGenre({ ...newGenre, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7001/api/genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`, // Lấy token từ cookie
        },
        body: JSON.stringify(newGenre),
      });
      const data = await response.json();
      if (data.isSuccess) {
        setMessage("Thêm genre thành công!");
        setNewGenre({ name: "", slug: "", status: true });
        navigate("/admin/genre");
      } else {
        setMessage("Thêm genre không thành công: " + data.message);
      }
    } catch (error) {
      setMessage("Lỗi: " + error.message);
    }
  };

  return (
    <div className="add-category-container">
      <h1>Thêm Genre</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên Genre:</label>
          <input
            type="text"
            name="name"
            value={newGenre.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Slug:</label>
          <input
            type="text"
            name="slug"
            value={newGenre.slug}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Trạng thái:</label>
          <select name="status" value={newGenre.status} onChange={handleChange}>
            <option value={true}>Kích hoạt</option>
            <option value={false}>Không kích hoạt</option>
          </select>
        </div>
        <button type="submit">Thêm Genre</button>
      </form>
    </div>
  );
};

export default AddGenre;
