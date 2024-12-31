import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Spinner from "../../components/Spinner/Spinner";
import Pagination from "../../components/Pagination/Pagination";

const Receipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const MEMBERSHIP = import.meta.env.VITE_MEMBERSHIP;

  useEffect(() => {
    const fetchReceipts = async () => {
      const userId = Cookies.get("userId");
      const authToken = Cookies.get("authToken");

      if (!userId) {
        setError("User ID not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${MEMBERSHIP}/api/receipts?PageNumber=${currentPage}&PageSize=${itemsPerPage}&userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok && Array.isArray(data.result)) {
          setReceipts(data.result);
          setTotalPages(data.pagination.totalPages);
        } else {
          setError(data.message || "Failed to fetch receipts.");
        }
      } catch (error) {
        setError("An error occurred while fetching receipts.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "#070720",
        padding: "20px",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        height: "500px",
      }}>
      <div style={{ height: "400px" }}>
        <h2 style={{ textAlign: "center" }}>USER RECEIPTS</h2>
        {receipts.length === 0 ? (
          <p>No receipts found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              margin: "20px 0",
              color: "#fff",
            }}>
            <thead>
              <tr>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>
                  Receipt ID
                </th>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>
                  Email
                </th>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>
                  Package ID
                </th>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>
                  Package Price
                </th>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>
                  Term (Months)
                </th>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>
                  Total Amount
                </th>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>
                  Discount Amount
                </th>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>
                  Status
                </th>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.receiptId}>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>
                    {receipt.receiptId}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>
                    {receipt.email}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>
                    {receipt.packageId}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>
                    {receipt.packagePrice}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>
                    {receipt.termInMonths}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>
                    {receipt.totalAmount}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>
                    {receipt.discountAmount || "N/A"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>
                    {receipt.status}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>
                    {new Date(receipt.createdDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {/* Pagination Controls */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            backgroundColor: "#1c1c1c",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            marginRight: "10px",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}>
          Previous
        </button>
        <span style={{ color: "#fff" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            backgroundColor: "#1c1c1c",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            marginLeft: "10px",
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}>
          Next
        </button>
      </div> */}
    </div>
  );
};

export default Receipt;
