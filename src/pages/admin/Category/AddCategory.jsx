import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./AddCategory.css";

const AddCategory = () => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    status: true,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7001/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`, // Lấy token từ cookie
        },
        body: JSON.stringify(newCategory),
      });
      const data = await response.json();
      if (data.isSuccess) {
        setMessage("Thêm category thành công!");
        setNewCategory({ name: "", slug: "", status: true });
        navigate("/admin/categories");
      } else {
        setMessage("Thêm category không thành công: " + data.message);
      }
    } catch (error) {
      setMessage("Lỗi: " + error.message);
    }
  };

  return (
    <div className="add-category-container">
      <h1>Thêm Category</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên Category:</label>
          <input
            type="text"
            name="name"
            value={newCategory.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Slug:</label>
          <input
            type="text"
            name="slug"
            value={newCategory.slug}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Trạng thái:</label>
          <select
            name="status"
            value={newCategory.status}
            onChange={handleChange}>
            <option value={true}>Kích hoạt</option>
            <option value={false}>Không kích hoạt</option>
          </select>
        </div>
        <button type="submit">Thêm Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
