import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./AddCountry.css";

const AddCountry = () => {
  const [newCountry, setNewCountry] = useState({
    name: "",
    status: true,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCountry({ ...newCountry, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://cineworld.io.vn:7001/api/countries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("authToken")}`, // Lấy token từ cookie
          },
          body: JSON.stringify(newCountry),
        }
      );
      const data = await response.json();
      if (data.isSuccess) {
        setMessage("Thêm country thành công!");
        setNewCountry({ name: "", status: true });
        navigate("/admin/countries");
      } else {
        setMessage("Thêm country không thành công: " + data.message);
      }
    } catch (error) {
      setMessage("Lỗi: " + error.message);
    }
  };

  return (
    <div className="add-category-container">
      <h1>Thêm Country</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên Country:</label>
          <input
            type="text"
            name="name"
            value={newCountry.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Trạng thái:</label>
          <select
            name="status"
            value={newCountry.status}
            onChange={handleChange}>
            <option value={true}>Kích hoạt</option>
            <option value={false}>Không kích hoạt</option>
          </select>
        </div>
        <button type="submit">Thêm Country</button>
      </form>
    </div>
  );
};

export default AddCountry;
