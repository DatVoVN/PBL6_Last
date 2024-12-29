import { useState, useEffect } from "react";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import { FaFilter } from "react-icons/fa";
const TABLE_HEADS = ["Country ID", "Name", "Status", "Action"];
const PAGE_SIZE = 6;

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState({ name: "", status: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [countryToEdit, setCountryToEdit] = useState(null);
  const [countryToDelete, setCountryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [countryToView, setCountryToView] = useState(null);
  const [totalPagesCountries, setTotalPagesCountries] = useState(1);
  const [filter, setFilter] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const MOVIE = import.meta.env.VITE_MOVIE;
  const fetchCountries = async (pageNumber, orderBy, query = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${MOVIE}/api/countries?Name=${query}&PageNumber=${pageNumber}&PageSize=${PAGE_SIZE}&OrderBy=${orderBy}`
      );
      const data = await response.json();
      setCountries(data.result || []);
      setTotalPagesCountries(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to fetch countries!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries(currentPage, filter, searchQuery);
  }, [currentPage, filter, searchQuery]);
  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  const handleAddCountry = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    const slug = newCountry.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const requestData = {
      countryId: 0,
      name: newCountry.name,
      slug,
      status: newCountry.status,
    };

    try {
      const response = await fetch(`${MOVIE}/api/countries`, {
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
          `Error adding country: ${errorResponse.message || "Unknown error"}`
        );
        return;
      }

      toast.success("Country added successfully!");
      fetchCountries(currentPage, "");
      setIsModalOpen(false);
      setNewCountry({ name: "", status: true });
    } catch (error) {
      toast.error(`Error adding country: ${error.message}`);
    }
  };
  const handleSearchClick = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
    fetchCountries(1, filter, searchInput);
  };
  const handleViewCountry = async (countryId) => {
    try {
      const response = await fetch(`${MOVIE}/api/countries/${countryId}`);
      const data = await response.json();
      setCountryToView(data.result);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching country details:", error);
      toast.error("Failed to fetch country details!");
    }
  };

  const handleEditCountry = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    const requestData = {
      countryId: countryToEdit.countryId,
      name: countryToEdit.name,
      slug: countryToEdit.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      status: countryToEdit.status,
    };

    try {
      const response = await fetch(
        `${MOVIE}/api/countries`, // Replace with your country API endpoint
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
          `Error editing country: ${errorResponse.message || "Unknown error"}`
        );
        return;
      }

      toast.success("Country updated successfully!");
      fetchCountries(currentPage, "");
      setIsEditModalOpen(false);
      setCountryToEdit(null);
    } catch (error) {
      toast.error(`Error editing country: ${error.message}`);
    }
  };

  const handleDeleteCountry = async (countryId) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    try {
      const response = await fetch(`${MOVIE}/api/countries?id=${countryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Error deleting country: ${errorText || "Unknown error"}`);
        return;
      }

      toast.success("Country deleted successfully!");
      fetchCountries(currentPage, "");
      setIsDeleteModalOpen(false);
      setCountryToDelete(null);
    } catch (error) {
      toast.error(`Error deleting country: ${error.message}`);
    }
  };
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPagesCountries) {
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
          COUNTRIES
        </h4>
        <div className="buttons-container">
          <button
            className="add-category-btn"
            style={{ color: "white" }}
            onClick={() => setIsModalOpen(true)}>
            Add Country
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
                  <option value="-CountryId">ID Descending</option>
                  <option value="CountryId">ID Ascending</option>
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
              {countries.length > 0 ? (
                countries.map((country) => (
                  <tr key={country.countryId}>
                    <td>{country.countryId}</td>
                    <td>{country.name}</td>
                    <td
                      className={`status-cell ${
                        country.status ? "status-active" : "status-inactive"
                      }`}>
                      {country.status ? "Active" : "Inactive"}
                    </td>
                    <td className="dt-cell-action">
                      <HiEye
                        size={20}
                        style={{ marginRight: "10px" }}
                        onClick={() => handleViewCountry(country.countryId)}
                      />
                      <HiPencilAlt
                        size={20}
                        style={{ marginRight: "10px", color: "gold" }}
                        onClick={() => {
                          setCountryToEdit(country);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <HiTrash
                        size={20}
                        style={{ marginRight: "10px", color: "red" }}
                        onClick={() => {
                          setCountryToDelete(country.countryId);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEADS.length}>No countries found</td>
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
              }}>{`Page ${currentPage} of ${totalPagesCountries}`}</span>
            <button
              disabled={currentPage === totalPagesCountries}
              onClick={() => goToPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      )}
      {isViewModalOpen && countryToView && (
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
            <h3 style={{ textAlign: "center" }}>Country Details</h3>
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
                  <td style={{ padding: "8px" }}>{countryToView.countryId}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Name:</td>
                  <td style={{ padding: "8px" }}>{countryToView.name}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Status:
                  </td>
                  <td style={{ padding: "8px" }}>
                    {countryToView.status ? "Active" : "Inactive"}
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
              Close
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Country</h2>

            <input
              type="text"
              value={newCountry.name}
              onChange={(e) =>
                setNewCountry({ ...newCountry, name: e.target.value })
              }
              placeholder="Country Name"
            />

            <label>
              <select
                value="true" // Always set the value to "true"
                disabled // Disable the select to prevent changes
              >
                <option value="true">Active</option>{" "}
                {/* Display 'Active' as the only option */}
              </select>
            </label>

            <button
              style={{ backgroundColor: "#475be8" }}
              onClick={handleAddCountry}>
              Add Country
            </button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && countryToEdit && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Country</h2>
            <input
              type="text"
              value={countryToEdit.name}
              onChange={(e) =>
                setCountryToEdit({ ...countryToEdit, name: e.target.value })
              }
              placeholder="Country Name"
            />
            <label>
              <select value={countryToEdit.status} disabled>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
            <button
              onClick={handleEditCountry}
              style={{ backgroundColor: "#475be8" }}>
              Update Country
            </button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && countryToDelete !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this country?</h2>
            <button
              style={{ backgroundColor: "red" }}
              onClick={() => handleDeleteCountry(countryToDelete)}>
              Yes
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Country;
