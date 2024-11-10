import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./UpdateCountry.css";
const UpdateCountry = () => {
  const { id } = useParams();
  const [country, setCountry] = useState({
    name: "",
    slug: "",
    status: true,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountry();
  }, []);

  const fetchCountry = async () => {
    try {
      const response = await fetch(
        `https://localhost:7001/api/countries/${id}`
      );
      const data = await response.json();
      if (data.isSuccess) {
        setCountry(data.result);
      } else {
        console.error("Failed to fetch country:", data.message);
      }
    } catch (error) {
      console.error("Error fetching country:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCountry({ ...country, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://localhost:7001/api/countries/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
          body: JSON.stringify(country),
        }
      );
      const data = await response.json();
      if (data.isSuccess) {
        setMessage("Cập nhật country thành công!");
        navigate("/admin/countries");
      } else {
        setMessage("Cập nhật country không thành công: " + data.message);
      }
    } catch (error) {
      setMessage("Lỗi: " + error.message);
    }
  };

  return (
    <div className="update-category-container">
      <h1>Cập nhật Country</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên Country:</label>
          <input
            type="text"
            name="name"
            value={country.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Slug:</label>
          <input
            type="text"
            name="slug"
            value={country.slug}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Trạng thái:</label>
          <select name="status" value={country.status} onChange={handleChange}>
            <option value={true}>Kích hoạt</option>
            <option value={false}>Không kích hoạt</option>
          </select>
        </div>
        <button type="submit">Cập nhật Country</button>
      </form>
    </div>
  );
};

export default UpdateCountry;
