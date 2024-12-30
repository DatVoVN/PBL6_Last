import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentSuccessPage.css";
import Cookies from "js-cookie";
function PaymentSuccessPage() {
  const [error, setError] = useState(""); // State to store error messages
  const token = Cookies.get("authToken"); // Get token from cookies
  const [validationResult, setValidationResult] = useState(null); // New state to display validation result
  const MEMBERSHIP = import.meta.env.VITE_MEMBERSHIP;
  const validateStripeSession = async (receiptId) => {
    try {
      const response = await fetch(
        `${MEMBERSHIP}/api/receipts/ValidateSession/${receiptId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${token}`,
          },
          body: null,
        }
      );

      const result = await response.json();
      if (!response.ok || !result.isSuccess) {
        console.error(
          "Validation error:",
          result.message || "Failed to validate"
        );
        throw new Error(result.message || "Failed to validate Stripe session");
      }

      console.log("Giờ bạn đã là thành viên:", result.message); // Log the message
      setValidationResult(
        result.message || "Session validation was successful"
      ); // Set a user-friendly message
      return result;
    } catch (error) {
      console.error("Error validating Stripe session:", error);
      setError(error.message);
    }
  };
  const receiptId = localStorage.getItem("receiptId");
  console.log("paymentsuccess", receiptId);

  if (receiptId) {
    console.log("Validating Stripe session with receiptId:", receiptId);
    validateStripeSession(receiptId);
  }
  const navigate = useNavigate();

  // Handler for navigating back to the home page
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f8fb",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}>
      <div
        style={{
          maxWidth: "500px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          textAlign: "center",
        }}>
        <h1 style={{ color: "#28a745", marginBottom: "20px" }}>
          Payment Successful! 🎉
        </h1>
        <p style={{ color: "#555", marginBottom: "15px", lineHeight: "1.5" }}>
          Thank you for your purchase. Your payment was processed successfully.
        </p>
        <p style={{ color: "#555", marginBottom: "20px", lineHeight: "1.5" }}>
          You can now enjoy your subscription. If you have any issues, feel free
          to contact our support team.
        </p>
        <button
          onClick={handleBackToHome}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}>
          Go to Home
        </button>
        {validationResult && (
          <p
            style={{
              marginTop: "20px",
              color: "#28a745",
              fontWeight: "bold",
            }}>
            {validationResult}
          </p>
        )}
        {error && (
          <p
            style={{
              marginTop: "20px",
              color: "#dc3545",
              fontWeight: "bold",
            }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
export default PaymentSuccessPage;
