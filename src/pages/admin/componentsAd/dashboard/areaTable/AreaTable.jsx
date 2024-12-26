import { useState, useEffect } from "react";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AreaTable.css";
import "font-awesome/css/font-awesome.min.css";
import { FaFilter } from "react-icons/fa";

const TABLE_HEADS = ["Category ID", "Name", "Status", "Action"];
const PAGE_SIZE = 7;
const MOVIE = import.meta.env.VITE_MOVIE;
const AreaTable = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", status: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [categoryToView, setCategoryToView] = useState(null);
  const [filter, setFilter] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const fetchCategories = async (pageNumber, orderBy, query = "") => {
    setIsLoading(true);
    try {
      // Modify the API request to include the `Name` parameter for searching
      const response = await fetch(
        `${MOVIE}/api/categories?Name=${query}&PageNumber=${pageNumber}&PageSize=${PAGE_SIZE}&OrderBy=${orderBy}`
      );
      const data = await response.json();
      setCategories(data.result || []);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories!");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories(currentPage, filter, searchQuery);
  }, [currentPage, filter, searchQuery]);

  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  const handleAddCategory = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    const slug = newCategory.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const requestData = {
      categoryId: 0,
      name: newCategory.name,
      slug,
      status: newCategory.status,
    };

    try {
      const response = await fetch(`${MOVIE}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(
          `Error adding category: ${errorResponse.message || "Unknown error"}`
        );
        return;
      }

      toast.success("Category added successfully!");
      fetchCategories(currentPage, "");
      setIsModalOpen(false);
      setNewCategory({ name: "", status: true });
    } catch (error) {
      toast.error(`Error adding category: ${error.message}`);
    }
  };
  const handleSearchClick = () => {
    setSearchQuery(searchInput); // Cập nhật giá trị thực tế để tìm kiếm
    setCurrentPage(1); // Reset về trang đầu tiên
    fetchCategories(1, filter, searchInput); // Gọi API với giá trị tìm kiếm
  };
  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchQuery(searchValue); // Update search query
    setCurrentPage(1); // Reset to first page when search changes

    // Fetch categories with the search query
    fetchCategories(1, filter, searchValue); // Fetch from the first page with the search query
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="content-area-table">
      <ToastContainer autoClose={2000} />

      <div className="data-table-info">
        <h4 className="data-table-title">CATEGORIES</h4>
        <div className="buttons-container">
          <button
            className="add-category-btn"
            style={{ color: "white" }}
            onClick={() => setIsModalOpen(true)}>
            Add Category
          </button>
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
                  <option value="-Name">Name Descending</option>
                  <option value="Name">Name Ascending</option>
                  <option value="-CategoryId">ID Descending</option>
                  <option value="CategoryId">ID Ascending</option>
                </select>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="text"
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              placeholder="Search by Name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              style={{
                padding: "8px 12px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleSearchClick}>
              Search
            </button>
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
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.categoryId}>
                    <td>{category.categoryId}</td>
                    <td>{category.name}</td>
                    <td
                      className={`status-cell ${
                        category.status ? "status-active" : "status-inactive"
                      }`}>
                      {category.status ? "Active" : "Inactive"}
                    </td>
                    <td className="dt-cell-action">
                      <HiEye
                        size={20}
                        style={{ marginRight: "10px" }}
                        onClick={() => handleViewCategory(category.categoryId)}
                      />
                      <HiPencilAlt
                        size={20}
                        style={{ marginRight: "10px", color: "gold" }}
                        onClick={() => {
                          setCategoryToEdit(category);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <HiTrash
                        size={20}
                        style={{ marginRight: "10px", color: "red" }}
                        onClick={() => {
                          setCategoryToDelete(category.categoryId);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEADS.length}>No categories found</td>
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
      {isViewModalOpen && categoryToView && (
        <div className="modal">
          <div className="modal-content">
            <h3>Category Details</h3>
            <p style={{ fontSize: "16px", margin: "10px 0px" }}>
              <strong>Category ID:</strong> {categoryToView.categoryId}
            </p>
            <p style={{ fontSize: "16px", margin: "10px 0px" }}>
              <strong>Name:</strong> {categoryToView.name}
            </p>
            <p style={{ fontSize: "16px", margin: "10px 0px" }}>
              <strong>Status:</strong>{" "}
              {categoryToView.status ? "Active" : "Inactive"}
            </p>
            <button
              className="close-modal-btn"
              onClick={() => setIsViewModalOpen(false)}>
              <i className="fa fa-times"></i> Close
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Category</h2>

            <input
              type="text"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              placeholder="Category Name"
            />

            <label>
              <select value="true" disabled>
                <option value="true">Active</option>{" "}
              </select>
            </label>

            <button
              style={{ backgroundColor: "#475be8" }}
              onClick={handleAddCategory}>
              Add Category
            </button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && categoryToEdit && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Category</h2>
            <input
              type="text"
              value={categoryToEdit.name}
              onChange={(e) =>
                setCategoryToEdit({ ...categoryToEdit, name: e.target.value })
              }
              placeholder="Category Name"
            />
            <label>
              <select value={categoryToEdit.status} disabled>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
            <button
              onClick={handleEditCategory}
              style={{ backgroundColor: "#475be8" }}>
              Update Category
            </button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && categoryToDelete !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this category?</h2>
            <button
              style={{ backgroundColor: "red" }}
              onClick={() => handleDeleteCategory(categoryToDelete)}>
              Yes
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AreaTable;
