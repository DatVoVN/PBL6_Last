import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./User.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://cineworld.io.vn:7000/api/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
      });
      const data = await response.json();
      if (data.isSuccess) {
        setUsers(data.result.filter((user) => user.role === "CUSTOMER"));
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUpdate = (user) => {
    navigate(`/admin/update-user/${user.id}`, { state: user });
  };

  const handleDelete = async (userId) => {
    try {
      await fetch(`https://cineworld.io.vn:7000/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  // Phân trang
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="admin">
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.fullName}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleUpdate(user)}>Update</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
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

export default User;
