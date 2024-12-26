import { useState, useEffect } from "react";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import { FaFilter } from "react-icons/fa";
const TABLE_HEADS = [
  "PackageId",
  "Name",
  "Description",
  "Price",
  "TermInMonths",
  "Status",
  "Currency",
  "Action",
];
const PAGE_SIZE = 7;

const Packages = () => {
  const [genres, setGenres] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: "", status: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState(null);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPagesGenres, setTotalPagesGenres] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [packageToView, setPackageToView] = useState(null);
  const [filter, setFilter] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryPrice, setSearchQueryPrice] = useState("");
  const [searchTermInMonths, setSearchTermInMonths] = useState("");
  const MEMBERSHIP = import.meta.env.VITE_MEMBERSHIP;
  const fetchPackages = async (
    pageNumber,
    orderBy,
    query = "",
    query1 = "",
    query2 = ""
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${MEMBERSHIP}/api/packages?Name=${query}&Price=${query1}&TermInMonths=${query2}&PageNumber=${pageNumber}&PageSize=${PAGE_SIZE}&OrderBy=${orderBy}`
      );

      const data = await response.json();
      setGenres(data.result || []);
      setTotalPagesGenres(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages!");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(genres);

  useEffect(() => {
    fetchPackages(
      currentPage,
      filter,
      searchQuery,
      searchQueryPrice,
      searchTermInMonths
    );
  }, [currentPage, filter, searchQuery, searchQueryPrice, searchTermInMonths]);
  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };
  const handleSearchChange = (event) => {
    const { name, value } = event.target;

    // Update state based on which input field is changed
    if (name === "Name") {
      setSearchQuery(value);
    } else if (name === "Price") {
      setSearchQueryPrice(value);
    } else if (name === "TermInMonths") {
      setSearchTermInMonths(value);
    }
  };

  const handleSearch = (field) => {
    // Reset to first page when a search is performed
    setCurrentPage(1);

    // Fetch the data with the updated search parameters
    if (field === "Name") {
      fetchPackages(
        1,
        filter,
        searchQuery,
        searchQueryPrice,
        searchTermInMonths
      );
    } else if (field === "Price") {
      fetchPackages(
        1,
        filter,
        searchQuery,
        searchQueryPrice,
        searchTermInMonths
      );
    } else if (field === "TermInMonths") {
      fetchPackages(
        1,
        filter,
        searchQuery,
        searchQueryPrice,
        searchTermInMonths
      );
    }
  };

  const handleAddPackage = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }
    const requestData = {
      packageId: 0,
      name: newPackage.name,
      description: newPackage.description,
      price: newPackage.price,
      termInMonths: newPackage.termInMonths,
      currency: newPackage.currency || "USD",
      status: newPackage.status || true,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${MEMBERSHIP}/api/packages`, {
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
      fetchPackages(currentPage, "");
      setIsModalOpen(false);
      setNewGenre({ name: "", status: true });
    } catch (error) {
      toast.error(`Error adding genre: ${error.message}`);
    }
  };

  const handleViewPackage = async (packageId) => {
    try {
      const response = await fetch(`${MEMBERSHIP}/api/packages/${packageId}`);
      const data = await response.json();
      setPackageToView(data.result);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching package details:", error);
      toast.error("Failed to fetch package details!");
    }
  };

  const handleEditPackage = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    const requestData = {
      packageId: packageToEdit.packageId, // ID of the package being edited
      name: packageToEdit.name, // Package name
      description: packageToEdit.description, // Package description
      price: packageToEdit.price, // Package price
      termInMonths: packageToEdit.termInMonths, // Package term
      currency: packageToEdit.currency || "USD", // Default to USD if not provided
      status: packageToEdit.status, // Package status (true/false)
      updatedDate: new Date().toISOString(), // Automatically set updated date
    };

    try {
      const response = await fetch(`${MEMBERSHIP}/api/packages`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(
          `Error editing package: ${errorResponse.message || "Unknown error"}`
        );
        return;
      }

      toast.success("Package updated successfully!");
      fetchPackages(currentPage, ""); // Refresh the package list
      setIsEditModalOpen(false); // Close the edit modal
      setPackageToEdit(null); // Clear the packageToEdit state
    } catch (error) {
      toast.error(`Error editing package: ${error.message}`);
    }
  };

  const handleDeletePackage = async (packageId) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    try {
      const response = await fetch(
        `${MEMBERSHIP}/api/packages?id=${packageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Error deleting package: ${errorText || "Unknown error"}`);
        return;
      }

      toast.success("Package deleted successfully!");
      fetchPackages(currentPage, "");
      setIsDeleteModalOpen(false);
      setPackageToDelete(null);
    } catch (error) {
      toast.error(`Error deleting package: ${error.message}`);
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
        <h4 className="data-table-title">PACKAGES</h4>
        <div
          className="buttons-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="add-category-btn"
              style={{ color: "white", fontWeight: "bold" }}
              onClick={() => setIsModalOpen(true)}>
              Add Package
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
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#0056b3")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#007bff")
                }>
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
                    <option value="-PackageId">ID Descending</option>
                    <option value="PackageId">ID Ascending</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
            <input
              type="text"
              name="Name"
              className="search-input"
              placeholder="Search by Name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <input
              type="text"
              name="Price"
              className="search-input"
              placeholder="Search by Price..."
              value={searchQueryPrice}
              onChange={handleSearchChange}
            />
            <input
              type="text"
              name="TermInMonths"
              className="search-input"
              placeholder="Search by Term In Months..."
              value={searchTermInMonths}
              onChange={handleSearchChange}
            />
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
                genres.map((packages) => (
                  <tr key={packages.packageId}>
                    <td>{packages.packageId}</td>
                    <td style={{ fontWeight: "bold" }}>{packages.name}</td>
                    <td>{packages.description}</td>
                    <td style={{ fontWeight: "bold" }}>{packages.price}</td>
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>
                      {packages.termInMonths}
                    </td>

                    <td
                      className={`status-cell ${
                        packages.status ? "status-active" : "status-inactive"
                      }`}>
                      {packages.status ? "Active" : "Inactive"}
                    </td>
                    <td style={{ textAlign: "center" }}>{packages.currency}</td>
                    <td className="dt-cell-action">
                      <HiEye
                        size={20}
                        style={{ marginRight: "10px" }}
                        onClick={() => handleViewPackage(packages.packageId)}
                      />
                      <HiPencilAlt
                        size={20}
                        style={{ marginRight: "10px", color: "gold" }}
                        onClick={() => {
                          setPackageToEdit(packages);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <HiTrash
                        size={20}
                        style={{ marginRight: "10px", color: "red" }}
                        onClick={() => {
                          setPackageToDelete(packages.packageId);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEADS.length}>No packages found</td>
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
            <span>{`Page ${currentPage} of ${totalPagesGenres}`}</span>
            <button
              disabled={currentPage === totalPagesGenres}
              onClick={() => goToPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal for viewing genre */}
      {isViewModalOpen && packageToView && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker background for more contrast
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeIn 0.5s", // Fade-in effect for the modal appearance
          }}>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px 40px",
              borderRadius: "12px", // More rounded corners
              width: "450px", // A bit wider
              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)", // Larger shadow for a more lifted effect
              overflowY: "auto",
              animation: "slideIn 0.5s ease-out", // Slide-in effect for the content
            }}>
            <h2
              style={{
                fontSize: "28px", // Larger font size for the title
                color: "#333",
                fontWeight: "bold",
                marginBottom: "20px",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}>
              {packageToView.name}
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#555",
                marginBottom: "12px",
                lineHeight: "1.6",
              }}>
              <strong>ID:</strong> {packageToView.packageId}
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "#555",
                marginBottom: "12px",
                lineHeight: "1.6",
              }}>
              <strong>Description:</strong> {packageToView.description}
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "#555",
                marginBottom: "12px",
                lineHeight: "1.6",
              }}>
              <strong>Price:</strong> {packageToView.price}
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "#555",
                marginBottom: "12px",
                lineHeight: "1.6",
              }}>
              <strong>Term in Months:</strong> {packageToView.termInMonths}
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "#555",
                marginBottom: "12px",
                lineHeight: "1.6",
              }}>
              <strong>Status:</strong>{" "}
              {packageToView.status ? "Active" : "Inactive"}
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "#555",
                marginBottom: "20px",
                lineHeight: "1.6",
              }}>
              <strong>Currency:</strong> {packageToView.currency}
            </p>
            <button
              onClick={() => setIsViewModalOpen(false)}
              style={{
                backgroundColor: "#FF5733", // Bright accent color for the button
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                width: "100%",
                transition: "background-color 0.3s, transform 0.2s",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#C0392B")} // Darker button color on hover
              onMouseOut={(e) => (e.target.style.backgroundColor = "#FF5733")} // Reset button color on hover out
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for adding genre */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Package</h2>

            {/* Input for Package Name */}
            <input
              type="text"
              value={newPackage.name}
              onChange={(e) =>
                setNewPackage({ ...newPackage, name: e.target.value })
              }
              placeholder="Package Name"
            />

            {/* Input for Package Description */}
            <textarea
              value={newPackage.description}
              style={{ padding: "10px" }}
              onChange={(e) =>
                setNewPackage({ ...newPackage, description: e.target.value })
              }
              placeholder="Package Description"
            />

            {/* Input for Package Price */}
            <input
              type="number"
              value={newPackage.price}
              onChange={(e) =>
                setNewPackage({ ...newPackage, price: e.target.value })
              }
              placeholder="Package Price"
            />

            {/* Input for Term in Months */}
            <input
              type="number"
              value={newPackage.termInMonths}
              onChange={(e) =>
                setNewPackage({ ...newPackage, termInMonths: e.target.value })
              }
              placeholder="Term in Months"
            />

            {/* Input for Currency */}
            <select
              value={newPackage.currency}
              onChange={(e) =>
                setNewPackage({ ...newPackage, currency: e.target.value })
              }>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="VND">VND</option>
            </select>

            {/* Status */}
            <label>
              <select
                value={newPackage.status ? "true" : "false"}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    status: e.target.value === "true",
                  })
                }>
                <option value="true">Active</option>
              </select>
            </label>

            {/* Action Buttons */}
            <button
              style={{ backgroundColor: "#475be8" }}
              onClick={handleAddPackage}>
              Add Package
            </button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Modal for editing genre */}
      {isEditModalOpen && packageToEdit && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Package</h2>

            <input
              type="text"
              value={packageToEdit.name}
              onChange={(e) =>
                setPackageToEdit({ ...packageToEdit, name: e.target.value })
              }
              placeholder="Package Name"
            />

            <textarea
              style={{ padding: "10px" }}
              value={packageToEdit.description}
              onChange={(e) =>
                setPackageToEdit({
                  ...packageToEdit,
                  description: e.target.value,
                })
              }
              placeholder="Package Description"
            />

            <input
              type="number"
              value={packageToEdit.price}
              onChange={(e) =>
                setPackageToEdit({ ...packageToEdit, price: e.target.value })
              }
              placeholder="Price"
            />

            <input
              type="number"
              value={packageToEdit.termInMonths}
              onChange={(e) =>
                setPackageToEdit({
                  ...packageToEdit,
                  termInMonths: e.target.value,
                })
              }
              placeholder="Term (Months)"
            />

            <select
              value={packageToEdit.currency}
              onChange={(e) =>
                setPackageToEdit({ ...packageToEdit, currency: e.target.value })
              }>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="VND">VND</option>
            </select>
            <button
              onClick={handleEditPackage}
              style={{ backgroundColor: "#475be8" }}>
              Update Package
            </button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Modal for deleting genre */}
      {isDeleteModalOpen && packageToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this package?</h2>
            <button
              style={{ backgroundColor: "red" }}
              onClick={() => handleDeletePackage(packageToDelete)}>
              Yes, Delete
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Packages;
