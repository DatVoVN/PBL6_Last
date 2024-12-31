import { useState, useEffect } from "react";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import { FaFilter } from "react-icons/fa";
const TABLE_HEADS = [
  "MemberShipId",
  "UserId",
  "UserEmail",
  "MemberType",
  "Action",
];
const PAGE_SIZE = 7;

const Membership = () => {
  const [memberships, setMemberships] = useState([]);
  const [newMembership, setNewMembership] = useState({
    name: "",
    status: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [membershipToEdit, setMembershipToEdit] = useState(null);
  const [membershipToDelete, setMembershipToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [membershipToView, setMembershipToView] = useState(null);
  const [totalPagesMemberships, setTotalPagesMemberships] = useState(1);
  const [filter, setFilter] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const MEMBERSHIP = import.meta.env.VITE_MEMBERSHIP;
  const fetchMemberships = async (pageNumber, orderBy, query = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${MEMBERSHIP}/api/memberships?UserEmail=${query}&PageNumber=${pageNumber}&PageSize=${PAGE_SIZE}&OrderBy=${orderBy}`
      );
      const data = await response.json();
      setMemberships(data.result || []);
      setTotalPagesMemberships(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      toast.error("Failed to fetch memberships!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships(currentPage, filter, searchQuery);
  }, [currentPage, filter, searchQuery]);
  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };
  const handleSearchClick = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
    fetchMemberships(1, filter, searchInput);
  };
  const handleViewMembership = async (MembershipId) => {
    try {
      const response = await fetch(
        `${MEMBERSHIP}/api/memberships/${MembershipId}`
      );
      const data = await response.json();
      setMembershipToView(data.result);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching Membership details:", error);
      toast.error("Failed to fetch Membership details!");
    }
  };
  const handleEditMembership = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    // Validate memberType before sending the request
    const validMemberTypes = [
      "First Time Member",
      "Consecutive Member",
      "Returning Member",
    ];
    if (!validMemberTypes.includes(membershipToEdit.memberType)) {
      toast.error(
        "Invalid member type. It must be one of: 'First Time Member', 'Consecutive Member', or 'Returning Member'."
      );
      return;
    }

    const requestData = {
      memberShipId: membershipToEdit.memberShipId,
      userId: membershipToEdit.userId,
      userEmail: membershipToEdit.userEmail,
      memberType: membershipToEdit.memberType,
      firstSubscriptionDate: membershipToEdit.firstSubscriptionDate,
      renewalStartDate: membershipToEdit.renewalStartDate,
      lastUpdatedDate: membershipToEdit.lastUpdatedDate,
      expirationDate: membershipToEdit.expirationDate,
    };

    // Log the requestData object before sending the API request
    console.log("Request Data:", requestData);

    try {
      const response = await fetch(`${MEMBERSHIP}/api/memberships`, {
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
          `Error editing Membership: ${
            errorResponse.message || "Unknown error"
          }`
        );
        return;
      }

      toast.success("Membership updated successfully!");
      fetchMemberships(currentPage, "", "");
      setIsEditModalOpen(false);
      setMembershipToEdit(null);
    } catch (error) {
      console.error("Error Details:", error);
      toast.error(`Error editing Membership: ${error.message}`);
    }
  };

  const handleDeleteMembership = async (MembershipId) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    try {
      const response = await fetch(
        `${MEMBERSHIP}/api/memberships?id=${MembershipId}`,
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
        toast.error(
          `Error deleting Membership: ${errorText || "Unknown error"}`
        );
        return;
      }

      toast.success("Membership deleted successfully!");
      fetchMemberships(currentPage, "", "");
      setIsDeleteModalOpen(false);
      setMembershipToDelete(null);
    } catch (error) {
      toast.error(`Error deleting Membership: ${error.message}`);
    }
  };
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPagesMemberships) {
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
          Memberships
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
                  <option value="-userName">UserName Descending</option>
                  <option value="userName">UserName Ascending</option>
                  <option value="-MembershipId">ID Descending</option>
                  <option value="MembershipId">ID Ascending</option>
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
              placeholder="Search by UserName..."
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
              {memberships.length > 0 ? (
                memberships.map((Membership) => (
                  <tr key={Membership.memberShipId}>
                    <td>{Membership.memberShipId}</td>
                    <td>{Membership.userId}</td>
                    <td>{Membership.userEmail}</td>
                    <td
                      className={`status-cell status-active
                      `}>
                      {Membership.memberType}
                    </td>
                    <td className="dt-cell-action">
                      <HiEye
                        size={20}
                        style={{ marginRight: "10px" }}
                        onClick={() =>
                          handleViewMembership(Membership.memberShipId)
                        }
                      />
                      <HiPencilAlt
                        size={20}
                        style={{ marginRight: "10px", color: "gold" }}
                        onClick={() => {
                          setMembershipToEdit(Membership);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <HiTrash
                        size={20}
                        style={{ marginRight: "10px", color: "red" }}
                        onClick={() => {
                          setMembershipToDelete(Membership.memberShipId);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEADS.length}>No memberships found</td>
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
              }}>{`Page ${currentPage} of ${totalPagesMemberships}`}</span>
            <button
              disabled={currentPage === totalPagesMemberships}
              onClick={() => goToPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      )}
      {isViewModalOpen && membershipToView && (
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
              animation: "fadeIn 0.5s", // Fade-in effect for the modal appearance
            }}>
            <h3 style={{ textAlign: "center" }}>Membership Details</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}>
              <tbody>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Membership ID
                  </td>
                  <td style={{ padding: "8px" }}>
                    {membershipToView.memberShipId}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    User ID
                  </td>
                  <td style={{ padding: "8px" }}>{membershipToView.userId}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    User Email
                  </td>
                  <td style={{ padding: "8px" }}>
                    {membershipToView.userEmail}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Member Type
                  </td>
                  <td style={{ padding: "8px" }}>
                    {membershipToView.memberType}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    First Subscription Date
                  </td>
                  <td style={{ padding: "8px" }}>
                    {new Date(
                      membershipToView.firstSubscriptionDate
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Renewal Start Date
                  </td>
                  <td style={{ padding: "8px" }}>
                    {new Date(
                      membershipToView.renewalStartDate
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Last Updated Date
                  </td>
                  <td style={{ padding: "8px" }}>
                    {new Date(
                      membershipToView.lastUpdatedDate
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>
                    Expiration Date
                  </td>
                  <td style={{ padding: "8px" }}>
                    {new Date(
                      membershipToView.expirationDate
                    ).toLocaleDateString()}
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

      {isEditModalOpen && membershipToEdit && (
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
              maxHeight: "80vh", // Maximum height for modal content
              overflowY: "auto", // Make it scrollable if content exceeds the max height
              margin: "auto",
              animation: "fadeIn 0.5s", // Fade-in effect for modal appearance
            }}>
            <h3 style={{ textAlign: "center" }}>Edit Membership</h3>

            <input
              type="text"
              value={membershipToEdit.userId}
              onChange={(e) =>
                setMembershipToEdit({
                  ...membershipToEdit,
                  userId: e.target.value,
                })
              }
              placeholder="User ID"
              disabled
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="email"
              value={membershipToEdit.userEmail}
              onChange={(e) =>
                setMembershipToEdit({
                  ...membershipToEdit,
                  userEmail: e.target.value,
                })
              }
              placeholder="User Email"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <select
              value={membershipToEdit.memberType}
              onChange={(e) =>
                setMembershipToEdit({
                  ...membershipToEdit,
                  memberType: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}>
              <option value="First Time Member">First Time Member</option>
              <option value="Consecutive Member">Consecutive Member</option>
              <option value="Returning Member">Returning Member</option>
            </select>

            <input
              type="date"
              value={new Date(membershipToEdit.firstSubscriptionDate)
                .toISOString()
                .substring(0, 10)}
              onChange={(e) =>
                setMembershipToEdit({
                  ...membershipToEdit,
                  firstSubscriptionDate: new Date(e.target.value).toISOString(),
                })
              }
              placeholder="First Subscription Date"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="date"
              value={new Date(membershipToEdit.renewalStartDate)
                .toISOString()
                .substring(0, 10)}
              onChange={(e) =>
                setMembershipToEdit({
                  ...membershipToEdit,
                  renewalStartDate: new Date(e.target.value).toISOString(),
                })
              }
              placeholder="Renewal Start Date"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="date"
              value={new Date(membershipToEdit.lastUpdatedDate)
                .toISOString()
                .substring(0, 10)}
              onChange={(e) =>
                setMembershipToEdit({
                  ...membershipToEdit,
                  lastUpdatedDate: new Date(e.target.value).toISOString(),
                })
              }
              placeholder="Last Updated Date"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="date"
              value={new Date(membershipToEdit.expirationDate)
                .toISOString()
                .substring(0, 10)}
              onChange={(e) =>
                setMembershipToEdit({
                  ...membershipToEdit,
                  expirationDate: new Date(e.target.value).toISOString(),
                })
              }
              placeholder="Expiration Date"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={handleEditMembership}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#475be8",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "15px",
              }}>
              Update Membership
            </button>

            <button
              onClick={() => setIsEditModalOpen(false)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#ccc",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "10px",
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && membershipToDelete !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this Membership?</h2>
            <button
              style={{ backgroundColor: "red" }}
              onClick={() => handleDeleteMembership(membershipToDelete)}>
              Yes
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Membership;
