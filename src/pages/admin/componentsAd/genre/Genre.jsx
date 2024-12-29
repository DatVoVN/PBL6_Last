import { useState, useEffect } from "react";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import { FaFilter } from "react-icons/fa";
const TABLE_HEADS = ["Genre ID", "Name", "Status", "Action"];
const PAGE_SIZE = 6;

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState({ name: "", status: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [genreToEdit, setGenreToEdit] = useState(null);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPagesGenres, setTotalPagesGenres] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [genreToView, setGenreToView] = useState(null);
  const [filter, setFilter] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const MOVIE = import.meta.env.VITE_MOVIE;
  const fetchGenres = async (pageNumber, orderBy, query = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${MOVIE}/api/genres?Name=${query}&PageNumber=${pageNumber}&PageSize=${PAGE_SIZE}&OrderBy=${orderBy}`
      );
      const data = await response.json();
      setGenres(data.result || []);
      setTotalPagesGenres(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching genres:", error);
      toast.error("Failed to fetch genres!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres(currentPage, filter, searchQuery);
  }, [currentPage, filter, searchQuery]);
  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  const handleSearchClick = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset về trang đầu tiên
    fetchGenres(1, filter, searchInput); // Gọi API với giá trị tìm kiếm
  };
  const handleAddGenre = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    const slug = newGenre.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const requestData = {
      genreId: 0,
      name: newGenre.name,
      slug,
      status: newGenre.status,
    };

    try {
      const response = await fetch(`${MOVIE}/api/genres`, {
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
          `Error adding genre: ${errorResponse.message || "Unknown error"}`
        );
        return;
      }

      toast.success("Genre added successfully!");
      fetchGenres(currentPage, "");
      setIsModalOpen(false);
      setNewGenre({ name: "", status: true });
    } catch (error) {
      toast.error(`Error adding genre: ${error.message}`);
    }
  };

  const handleViewGenre = async (genreId) => {
    try {
      const response = await fetch(`${MOVIE}/api/genres/${genreId}`);
      const data = await response.json();
      setGenreToView(data.result);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching genre details:", error);
      toast.error("Failed to fetch genre details!");
    }
  };

  const handleEditGenre = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    const requestData = {
      genreId: genreToEdit.genreId,
      name: genreToEdit.name,
      slug: genreToEdit.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      status: genreToEdit.status,
    };

    try {
      const response = await fetch(
        `${MOVIE}/api/genres`, // Replace with your genre API endpoint
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(
          `Error editing genre: ${errorResponse.message || "Unknown error"}`
        );
        return;
      }

      toast.success("Genre updated successfully!");
      fetchGenres(currentPage, "");
      setIsEditModalOpen(false);
      setGenreToEdit(null);
    } catch (error) {
      toast.error(`Error editing genre: ${error.message}`);
    }
  };

  const handleDeleteGenre = async (genreId) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    try {
      const response = await fetch(`${MOVIE}/api/genres?id=${genreId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Error deleting genre: ${errorText || "Unknown error"}`);
        return;
      }

      toast.success("Genre deleted successfully!");
      fetchGenres(currentPage, "");
      setIsDeleteModalOpen(false);
      setGenreToDelete(null);
    } catch (error) {
      toast.error(`Error deleting genre: ${error.message}`);
    }
  };
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPagesGenres) {
      setCurrentPage(page);
    }
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
          GENRES
        </h4>
        <div className="buttons-container">
          <button
            className="add-category-btn"
            style={{ color: "white" }}
            onClick={() => setIsModalOpen(true)}>
            Add Genre
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
                  <option value="-GenreId">ID Descending</option>
                  <option value="GenreId">ID Ascending</option>
                </select>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
              marginLeft: "30px",
            }}>
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
              {genres.length > 0 ? (
                genres.map((genre) => (
                  <tr key={genre.genreId}>
                    <td>{genre.genreId}</td>
                    <td>{genre.name}</td>
                    <td
                      className={`status-cell ${
                        genre.status ? "status-active" : "status-inactive"
                      }`}>
                      {genre.status ? "Active" : "Inactive"}
                    </td>
                    <td className="dt-cell-action">
                      <HiEye
                        size={20}
                        style={{ marginRight: "10px" }}
                        onClick={() => handleViewGenre(genre.genreId)}
                      />
                      <HiPencilAlt
                        size={20}
                        style={{ marginRight: "10px", color: "gold" }}
                        onClick={() => {
                          setGenreToEdit(genre);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <HiTrash
                        size={20}
                        style={{ marginRight: "10px", color: "red" }}
                        onClick={() => {
                          setGenreToDelete(genre.genreId);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEADS.length}>No genres found</td>
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
              }}>{`Page ${currentPage} of ${totalPagesGenres}`}</span>
            <button
              disabled={currentPage === totalPagesGenres}
              onClick={() => goToPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal for viewing genre */}
      {isViewModalOpen && genreToView && (
        <div className="modal">
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxWidth: "500px",
              margin: "auto",
            }}>
            <h3 style={{ textAlign: "center" }}>Genre Details</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}>
              <tbody>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Country ID
                  </td>
                  <td style={{ padding: "8px" }}>{genreToView.genreId}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Name:</td>
                  <td style={{ padding: "8px" }}>{genreToView.name}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Status:
                  </td>
                  <td style={{ padding: "8px" }}>
                    {genreToView.status ? "Active" : "Inactive"}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={() => setIsViewModalOpen(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}>
              <i className="fa fa-times" style={{ marginRight: "8px" }}></i>{" "}
              Close
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Genre</h2>

            <input
              type="text"
              value={newGenre.name}
              onChange={(e) =>
                setNewGenre({ ...newGenre, name: e.target.value })
              }
              placeholder="Genre"
            />

            <label>
              <select value="true" disabled>
                <option value="true">Active</option>
              </select>
            </label>

            <button
              style={{ backgroundColor: "#475be8" }}
              onClick={handleAddGenre}>
              Add Genre
            </button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {isEditModalOpen && genreToEdit && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Genre</h2>
            <input
              type="text"
              value={genreToEdit.name}
              onChange={(e) =>
                setGenreToEdit({ ...genreToEdit, name: e.target.value })
              }
              placeholder="Genre Name"
            />
            <label>
              <select value={genreToEdit.status} disabled>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
            <button
              onClick={handleEditGenre}
              style={{ backgroundColor: "#475be8" }}>
              Update Genre
            </button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {isDeleteModalOpen && genreToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this genre?</h2>
            <button
              onClick={() => handleDeleteGenre(genreToDelete)}
              style={{ backgroundColor: "red" }}>
              Yes
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Genre;
