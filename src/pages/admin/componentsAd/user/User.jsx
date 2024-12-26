import { useState, useEffect } from "react";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdChangeCircle } from "react-icons/md";

const TABLE_HEADS = [
  "Username",
  "Avatar",
  "Date of birth",
  "Gender",
  "Email",
  "Role",
  "Action",
];
const USERS_PER_PAGE = 7;

const User = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const USER = import.meta.env.VITE_USER;
  const fetchUsers = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${USER}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setUsers(data.result || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const handleChangeRole = async (email) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
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
      fetchUsers();
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
      fetchCategories();
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(`Error deleting category: ${error.message}`);
    }
  };
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="content-area-table">
      <ToastContainer autoClose={2000} />
      <div className="data-table-info">
        <h4 className="data-table-title">USERS</h4>
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
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>
                      <img
                        src={user.avatar || "placeholder-avatar.png"}
                        alt="Avatar"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td>{user.dateOfBirth}</td>
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
                        // Add edit logic here
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
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
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

      {/* Edit User Modal */}
      {isEditModalOpen && userToEdit && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User</h3>
            <form>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={userToEdit.username}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      username: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={userToEdit.email}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Role</label>
                <select
                  value={userToEdit.role}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      role: e.target.value,
                    })
                  }>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleEditUser}>
                  Save Changes
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(false)}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
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
    </section>
  );
};

export default User;
