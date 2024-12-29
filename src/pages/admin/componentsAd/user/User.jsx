import { useState, useEffect } from "react";
import { HiEye, HiFire, HiPencilAlt, HiTrash } from "react-icons/hi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdChangeCircle } from "react-icons/md";
import { FaFilter } from "react-icons/fa";

const TABLE_HEADS = [
  "Username",
  "Avatar",
  "Date of birth",
  "Gender",
  "Email",
  "Role",
  "Action",
];

const User = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPagesUser, setTotalPagesUser] = useState(1);
  const [filter, setFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQueryEmail, setSearchQueryEmail] = useState("");
  const [searchQueryRole, setSearchQueryRole] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedMemberType, setSelectedMemberType] = useState("");
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  // Membership types options
  const memberTypes = [
    "First Time Member",
    "Consecutive Member",
    "Returning Member",
  ];
  const USER = import.meta.env.VITE_USER;
  const fetchUsers = async (pageNumber, query1 = "", query2 = "", orderBy) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${USER}/api/users?Email=${query1}&Role=${query2}&PageNumber=${pageNumber}&PageSize=6&OrderBy=${orderBy}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setUsers(data.result || []);
      setTotalPagesUser(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users!");
    } finally {
      setIsLoading(false);
    }
  };
  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };
  const handleMembershipChange = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    const requestData = {
      memberShipId: 0, // Update this based on your logic
      userId: "string", // Replace with actual user ID
      userEmail: "user@example.com", // Replace with actual user email
      memberType: selectedMemberType,
      firstSubscriptionDate: new Date().toISOString(),
      renewalStartDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
      expirationDate: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        "https://cineworld.io.vn:7002/api/memberships",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(`Failed to update membership: ${errorResponse.message}`);
        return;
      }

      toast.success("Membership updated successfully!");
      setIsMembershipModalOpen(false); // Close the modal after successful API call
    } catch (error) {
      console.error("Error updating membership:", error);
      toast.error("Failed to update membership!");
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    if (name === "Email") {
      setSearchQueryEmail(value);
    } else if (name === "Role") {
      setSearchQueryRole(value);
    }
  };
  useEffect(() => {
    fetchUsers(currentPage, searchQueryEmail, searchQueryRole, filter);
  }, [currentPage, searchQueryEmail, searchQueryRole, filter]);

  const handleUpdateUser = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    try {
      const response = await fetch(
        `https://cineworld.io.vn:7000/api/users/UpdateInformation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            id: userToEdit.id,
            fullName: userToEdit.fullName,
            avatar: userToEdit.avatar,
            gender: userToEdit.gender,
            dateOfBirth: userToEdit.dateOfBirth,
            createdDate: new Date().toISOString(), // Set to current date if needed
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(`Failed to update user: ${errorResponse.message}`);
        return;
      }

      toast.success("User updated successfully!");
      fetchUsers(1);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user!");
    }
  };

  const handleChangeRole = async (email) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    // Ask for confirmation before changing the role
    const isConfirmed = window.confirm(
      "Are you sure you want to change this user's role to Admin?"
    );
    if (!isConfirmed) {
      return; // If user doesn't confirm, don't proceed with the role change
    }

    const requestData = { email, role: "Admin" };

    try {
      const response = await fetch(`${USER}/api/auth/AssignRole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(`Failed to change role: ${errorResponse.message}`);
        return;
      }

      toast.success("Role changed successfully!");
      fetchUsers(1); // Refresh the user list after role change
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error("Failed to change role!");
    }
  };

  const handleDeleteUser = async (userId) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }
    try {
      const response = await fetch(`${USER}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Error deleting user: ${errorText || "Unknown error"}`);
        return;
      }

      toast.success("User deleted successfully!");
      fetchUsers(1, "", "", "");
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(`Error deleting category: ${error.message}`);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPagesUser) {
      setCurrentPage(page);
    }
  };
  const handleEditClick = (user) => {
    setUserToEdit({ ...user });
    setIsEditModalOpen(true);
  };

  return (
    <section className="content-area-table">
      <ToastContainer autoClose={2000} />
      <div className="data-table-info">
        <h4
          className="data-table-title"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "30px",
            color: "#1fc3f9",
            background: "linear-gradient(to right, #00ffe8, #db8e00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}>
          USERS
        </h4>
        <div className="buttons-container">
          <div className="filter-container">
            <button
              className="filter-btn"
              onClick={toggleFilter}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                width: "100px",
                border: "none",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "16px",
                marginBottom: "10px",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}>
              <FaFilter size={20} style={{ marginRight: "8px" }} /> Filter
            </button>

            {isFilterVisible && (
              <div className="filter-dropdown">
                <select
                  className="filter-select"
                  value={filter}
                  onChange={handleFilterChange}>
                  <option value="">Default</option>
                  <option value="-fullName">fullName Descending</option>
                  <option value="fullName">fullName Ascending</option>
                  <option value="-Email">Email Descending</option>
                  <option value="Email">Email Ascending</option>
                </select>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              alignItems: "center",
              marginLeft: "50px",
            }}>
            <input
              type="text"
              name="Email"
              className="search-input"
              placeholder="Search by Email..."
              value={searchQueryEmail}
              onChange={handleSearchChange}
            />
            <select
              name="Role"
              className="search-input"
              value={searchQueryRole}
              onChange={handleSearchChange}>
              <option value="">DEFAULT</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="CUSTOMER, ADMIN">CUSTOMER, ADMIN</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="data-table-diagram">
          <table>
            <thead>
              <tr>
                {TABLE_HEADS.map((th, index) => (
                  <th key={index}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>
                      <img
                        src={user.avatar || "placeholder-avatar.png"}
                        alt="Avatar"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td>
                      {new Date(user.dateOfBirth).toLocaleDateString("en-CA")}
                    </td>

                    <td>{user.gender}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role}
                      {user.role === "CUSTOMER" && (
                        <MdChangeCircle
                          size={20}
                          style={{
                            marginLeft: "10px",
                            marginBottom: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleChangeRole(user.email)}
                        />
                      )}
                    </td>
                    <td className="dt-cell-action">
                      <HiPencilAlt
                        size={20}
                        style={{
                          marginRight: "10px",
                          cursor: "pointer",
                          color: "gold",
                        }}
                        onClick={() => handleEditClick(user)}
                      />

                      <HiTrash
                        size={20}
                        style={{
                          marginRight: "10px",
                          cursor: "pointer",
                          color: "red",
                        }}
                        onClick={() => {
                          setCategoryToDelete(user.id);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                      <HiFire
                        size={20}
                        style={{ marginRight: "10px", cursor: "pointer" }}
                        onClick={() => setIsMembershipModalOpen(true)} // Open modal on click
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEADS.length}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}>
              Previous
            </button>
            <span
              style={{
                color: "red",
              }}>{`Page ${currentPage} of ${totalPagesUser}`}</span>
            <button
              disabled={currentPage === totalPagesUser}
              onClick={() => goToPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New User</h3>
            <form>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleAddUser}>
                  Add User
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditModalOpen && userToEdit && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(); // Trigger update on form submit
              }}>
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  value={userToEdit.fullName}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Avatar URL</label>
                <input
                  type="text"
                  value={userToEdit.avatar}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, avatar: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Gender</label>
                <select
                  value={userToEdit.gender}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, gender: e.target.value })
                  }>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={
                    userToEdit.dateOfBirth
                      ? userToEdit.dateOfBirth.split("T")[0]
                      : ""
                  } // Extract date part in YYYY-MM-DD format
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      dateOfBirth: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setIsEditModalOpen(false)}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && categoryToDelete !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this user?</h2>
            <button
              style={{ backgroundColor: "red" }}
              onClick={() => handleDeleteUser(categoryToDelete)}>
              Yes
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}
      {isMembershipModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}>
            <h4 style={{ marginBottom: "15px" }}>Select Membership Type</h4>
            <select
              value={selectedMemberType}
              onChange={(e) => setSelectedMemberType(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "15px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}>
              <option value="">Select Member Type</option>
              {memberTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleMembershipChange}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}>
                Submit
              </button>
              <button
                onClick={() => setIsMembershipModalOpen(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default User;
