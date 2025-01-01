import { useState, useEffect } from "react";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import { FaFilter } from "react-icons/fa";
const TABLE_HEADS = [
  "CouponId",
  "CouponCode",
  "DiscountAmount",
  "DurationInMonths",
  "UsageLimit",
  "UsageCount",
  "IsActive",
  "Action",
];
const PAGE_SIZE = 6;

const Coupon = () => {
  const [Coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    couponCode: "",
    discountAmount: null,
    isActive: true,
    usageLimit: null,
    usageCount: null,
    createdDate: new Date().toISOString(),
    duration: "repeating",
    durationInMonths: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [CouponToEdit, setCouponToEdit] = useState(null);
  const [CouponToDelete, setCouponToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [CouponToView, setCouponToView] = useState(null);
  const [totalPagesCoupons, setTotalPagesCoupons] = useState(1);
  const [filter, setFilter] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const MEMBERSHIP = import.meta.env.VITE_MEMBERSHIP;
  const fetchCoupons = async (pageNumber, orderBy, query = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${MEMBERSHIP}/api/coupons?CouponCode=${query}&PageNumber=${pageNumber}&PageSize=${PAGE_SIZE}&OrderBy=${orderBy}`
      );
      const data = await response.json();
      setCoupons(data.result || []);
      setTotalPagesCoupons(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching Coupons:", error);
      toast.error("Failed to fetch Coupons!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(currentPage, filter, searchQuery);
  }, [currentPage, filter, searchQuery]);
  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };
  const handleSearchClick = () => {
    setSearchQuery(searchInput); // Cập nhật giá trị thực tế để tìm kiếm
    setCurrentPage(1); // Reset về trang đầu tiên
    fetchCoupons(1, filter, searchInput); // Gọi API với giá trị tìm kiếm
  };
  const handleViewCoupon = async (CouponId) => {
    try {
      const response = await fetch(`${MEMBERSHIP}/api/coupons/${CouponId}`);
      const data = await response.json();
      setCouponToView(data.result);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching Coupon details:", error);
      toast.error("Failed to fetch Coupon details!");
    }
  };
  const handleEditCoupon = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }
    if (!CouponToEdit.couponCode) {
      toast.error("Coupon code is required.");
      return;
    }

    const validDurations = ["once", "repeating", "forever"];
    if (!validDurations.includes(CouponToEdit.duration)) {
      toast.error(
        "Invalid duration. It must be one of: 'once', 'repeating', or 'forever'."
      );
      return;
    }

    const requestData = {
      couponId: CouponToEdit.couponId,
      couponCode: CouponToEdit.couponCode,
      discountAmount: CouponToEdit.discountAmount,
      isActive: CouponToEdit.isActive,
      usageLimit: CouponToEdit.usageLimit,
      usageCount: CouponToEdit.usageCount,
      createdDate: CouponToEdit.createdDate, // Assuming createdDate is a valid ISO string
      duration: CouponToEdit.duration,
      durationInMonths: CouponToEdit.durationInMonths,
    };
    try {
      const response = await fetch(`${MEMBERSHIP}/api/Coupons`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API Error Response:", errorResponse);
        toast.error(
          `Error editing Coupon: ${errorResponse.message || "Unknown error"}`
        );
        return;
      }

      toast.success("Coupon updated successfully!");
      fetchCoupons(currentPage, "");
      setIsEditModalOpen(false);
      setCouponToEdit(null);
    } catch (error) {
      console.error("Error Details:", error);
      toast.error(`Error editing Coupon: ${error.message}`);
    }
  };

  const handleAddCoupon = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    // Define the request data for adding the coupon
    const requestData = {
      couponId: 0, // Set couponId to 0 for creating a new coupon
      couponCode: newCoupon.couponCode, // Assuming newCoupon contains the couponCode field
      discountAmount: newCoupon.discountAmount, // Assuming newCoupon contains the discountAmount field
      isActive: newCoupon.isActive, // Assuming newCoupon contains the isActive field
      usageLimit: newCoupon.usageLimit, // Assuming newCoupon contains the usageLimit field
      usageCount: newCoupon.usageCount, // Assuming newCoupon contains the usageCount field
      createdDate: newCoupon.createdDate, // Assuming newCoupon contains the createdDate field
      duration: newCoupon.duration, // Assuming newCoupon contains the duration field
      durationInMonths: newCoupon.durationInMonths, // Assuming newCoupon contains the durationInMonths field
    };

    try {
      // Send the POST request to add the coupon
      const response = await fetch(`${MEMBERSHIP}/api/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      // Handle unsuccessful response
      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(
          `Error adding coupon: ${errorResponse.message || "Unknown error"}`
        );
        return;
      }
      toast.success("Coupon added successfully!");
      fetchCoupons(currentPage, "");
      setIsModalOpen(false);
      setNewCoupon({});
    } catch (error) {
      toast.error(`Error adding coupon: ${error.message}`);
    }
  };

  const handleDeleteCoupon = async (CouponId) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    try {
      const response = await fetch(`${MEMBERSHIP}/api/coupons?id=${CouponId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 204) {
        toast.success("Coupon deleted successfully!");
        fetchCoupons(currentPage, "");
        setIsDeleteModalOpen(false);
        setCouponToDelete(null);
      } else {
        const errorText = await response.text();
        toast.error(`Error deleting Coupon: ${errorText || "Unknown error"}`);
      }
    } catch (error) {
      toast.error(`Error deleting Coupon: ${error.message}`);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPagesCoupons) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="content-area-table">
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
          COUPONS
        </h4>
        <div className="buttons-container">
          <button
            className="add-category-btn"
            style={{ color: "white" }}
            onClick={() => setIsModalOpen(true)}>
            Add Coupon
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
                  <option value="-DiscountAmount">
                    DiscountAmount Descending
                  </option>
                  <option value="DiscountAmount">
                    DiscountAmount Ascending
                  </option>
                  <option value="-CouponCode">CouponCode Descending</option>
                  <option value="CouponCode">CouponCode Ascending</option>
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
              placeholder="Search by CouponCode..."
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
              {Coupons.length > 0 ? (
                Coupons.map((Coupon) => (
                  <tr key={Coupon.couponId}>
                    <td>{Coupon.couponId}</td>
                    <td>{Coupon.couponCode}</td>
                    <td>{Coupon.discountAmount}</td>
                    <td>{Coupon.durationInMonths}</td>
                    <td>{Coupon.usageLimit}</td>
                    <td>{Coupon.usageCount}</td>
                    <td
                      className={`status-cell ${
                        Coupon.isActive ? "status-active" : "status-inactive"
                      }`}>
                      {Coupon.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="dt-cell-action">
                      <HiEye
                        size={20}
                        style={{ marginRight: "10px" }}
                        onClick={() => handleViewCoupon(Coupon.couponId)}
                      />
                      <HiPencilAlt
                        size={20}
                        style={{ marginRight: "10px", color: "gold" }}
                        onClick={() => {
                          setCouponToEdit(Coupon);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <HiTrash
                        size={20}
                        style={{ marginRight: "10px", color: "red" }}
                        onClick={() => {
                          setCouponToDelete(Coupon.couponId);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEADS.length}>No Coupons found</td>
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
              }}>{`Page ${currentPage} of ${totalPagesCoupons}`}</span>
            <button
              disabled={currentPage === totalPagesCoupons}
              onClick={() => goToPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      )}
      {isViewModalOpen && CouponToView && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}>
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
            <h3 style={{ textAlign: "center" }}>Coupon Details</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}>
              <tbody>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Coupon ID
                  </td>
                  <td style={{ padding: "8px" }}>{CouponToView.couponId}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Coupon Code
                  </td>
                  <td style={{ padding: "8px" }}>{CouponToView.couponCode}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Discount Amount
                  </td>
                  <td style={{ padding: "8px" }}>
                    ${CouponToView.discountAmount.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Is Active
                  </td>
                  <td style={{ padding: "8px" }}>
                    {CouponToView.isActive ? "Yes" : "No"}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Usage Limit
                  </td>
                  <td style={{ padding: "8px" }}>{CouponToView.usageLimit}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Usage Count
                  </td>
                  <td style={{ padding: "8px" }}>{CouponToView.usageCount}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Created Date
                  </td>
                  <td style={{ padding: "8px" }}>
                    {new Date(CouponToView.createdDate).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Duration
                  </td>
                  <td style={{ padding: "8px" }}>{CouponToView.duration}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Duration in Months
                  </td>
                  <td style={{ padding: "8px" }}>
                    {CouponToView.durationInMonths}
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
                marginTop: "15px",
              }}>
              <i className="fa fa-times" style={{ marginRight: "8px" }}></i>{" "}
              Close
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="modal"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}>
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}>
            <h2>Add Coupon</h2>
            <input
              type="text"
              value={newCoupon.couponCode}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, couponCode: e.target.value })
              }
              placeholder="Coupon Code"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <input
              type="number"
              value={newCoupon.discountAmount}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  discountAmount: parseFloat(e.target.value),
                })
              }
              placeholder="Discount Amount"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <label>
              <select
                value={newCoupon.isActive}
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    isActive: e.target.value === "true",
                  })
                }
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "10px",
                  fontSize: "16px",
                }}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>

            <input
              type="number"
              value={newCoupon.usageLimit}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  usageLimit: parseInt(e.target.value),
                })
              }
              placeholder="Usage Limit"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <input
              type="number"
              value={newCoupon.usageCount}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  usageCount: parseInt(e.target.value),
                })
              }
              placeholder="Usage Count"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <input
              type="datetime-local"
              value={
                newCoupon.createdDate
                  ? new Date(newCoupon.createdDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  createdDate: new Date(e.target.value).toISOString(),
                })
              }
              placeholder="Created Date"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <label>
              <select
                value={newCoupon.duration}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, duration: e.target.value })
                }
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "10px",
                  fontSize: "16px",
                }}>
                <option value="repeating">Repeating</option>
                <option value="once">Once</option>
                <option value="forever">Forever</option>
              </select>
            </label>

            <input
              type="number"
              value={newCoupon.durationInMonths}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  durationInMonths: parseInt(e.target.value),
                })
              }
              placeholder="Duration In Months"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <div>
              <button
                style={{
                  backgroundColor: "#475be8",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
                onClick={handleAddCoupon}>
                Add Coupon
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && CouponToEdit && (
        <div
          className="modal"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}>
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}>
            <h2>Edit Coupon</h2>
            <input
              type="text"
              value={CouponToEdit.couponCode}
              onChange={(e) =>
                setCouponToEdit({
                  ...CouponToEdit,
                  couponCode: e.target.value,
                })
              }
              placeholder="Coupon Code"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <input
              type="number"
              value={CouponToEdit.discountAmount}
              onChange={(e) =>
                setCouponToEdit({
                  ...CouponToEdit,
                  discountAmount: parseFloat(e.target.value),
                })
              }
              placeholder="Discount Amount"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <select
              value={CouponToEdit.isActive}
              onChange={(e) =>
                setCouponToEdit({
                  ...CouponToEdit,
                  isActive: e.target.value === "true",
                })
              }
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>

            <input
              type="number"
              value={CouponToEdit.usageLimit}
              onChange={(e) =>
                setCouponToEdit({
                  ...CouponToEdit,
                  usageLimit: parseInt(e.target.value, 10),
                })
              }
              placeholder="Usage Limit"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <input
              type="number"
              value={CouponToEdit.usageCount}
              onChange={(e) =>
                setCouponToEdit({
                  ...CouponToEdit,
                  usageCount: parseInt(e.target.value, 10),
                })
              }
              placeholder="Usage Count"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <input
              type="datetime-local"
              value={
                CouponToEdit.createdDate
                  ? new Date(CouponToEdit.createdDate)
                      .toISOString()
                      .substring(0, 19)
                  : ""
              }
              onChange={(e) =>
                setCouponToEdit({
                  ...CouponToEdit,
                  createdDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                })
              }
              placeholder="Created Date"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <select
              value={CouponToEdit.duration}
              onChange={(e) =>
                setCouponToEdit({
                  ...CouponToEdit,
                  duration: e.target.value,
                })
              }
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}>
              <option value="once">Once</option>
              <option value="repeating">Repeating</option>
              <option value="forever">Forever</option>
            </select>

            <input
              type="number"
              value={CouponToEdit.durationInMonths}
              onChange={(e) =>
                setCouponToEdit({
                  ...CouponToEdit,
                  durationInMonths: parseInt(e.target.value, 10),
                })
              }
              placeholder="Duration in Months"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <div>
              <button
                onClick={handleEditCoupon}
                style={{
                  backgroundColor: "#475be8",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}>
                Update Coupon
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && CouponToDelete !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this Coupon?</h2>
            <button
              style={{ backgroundColor: "red" }}
              onClick={() => handleDeleteCoupon(CouponToDelete)}>
              Yes
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Coupon;
