import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./UpdateCategory.css";

const UpdateCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({
    CategoryId: id, // Set CategoryId directly here
    name: "",
    slug: "",
    status: true,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await fetch(
        `https://localhost:7001/api/categories/${id}`
      );
      const data = await response.json();
      if (data.isSuccess) {
        setCategory({ ...data.result, CategoryId: id });
      } else {
        console.error("Failed to fetch category:", data.message);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({
      ...category,
      [name]: name === "status" ? value === "true" : value, // Ensure boolean for status
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:7001/api/categories`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify(category),
      });

      console.log("Request Body:", JSON.stringify(category));

      if (response.ok) {
        const data = await response.json();
        console.log("Response Body:", data);

        if (data.isSuccess) {
          setMessage("Cập nhật category thành công!");
          navigate("/admin/categories");
        } else {
          setMessage("Cập nhật category không thành công: " + data.message);
        }
      } else {
        setMessage("Request failed with status: " + response.status);
      }
    } catch (error) {
      setMessage("Lỗi: " + error.message);
      console.log("Error message:", error.message);
    }
  };

  return (
    <div className="update-category-container">
      <h1>Cập nhật Category</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên Category:</label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Slug:</label>
          <input
            type="text"
            name="slug"
            value={category.slug}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Trạng thái:</label>
          <select name="status" value={category.status} onChange={handleChange}>
            <option value={true}>Kích hoạt</option>
            <option value={false}>Không kích hoạt</option>
          </select>
        </div>
        <button type="submit">Cập nhật Category</button>
      </form>
    </div>
  );
};

export default UpdateCategory;
