import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentErrorPage() {
  const navigate = useNavigate();

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
        backgroundColor: "#e9ecef", // Soft light gray for better contrast
        fontFamily: "'Roboto', sans-serif", // Modern font
        padding: "20px",
      }}>
      <div
        style={{
          maxWidth: "400px",
          backgroundColor: "#ffffff", // Clean white background
          borderRadius: "15px", // Softer edges
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)", // Subtle shadow for depth
          padding: "40px",
          textAlign: "center",
          animation: "fadeIn 0.5s ease-in-out", // Add fade-in animation
        }}>
        <h1
          style={{
            color: "#dc3545", // Bright red for error emphasis
            marginBottom: "20px",
            fontSize: "24px",
            fontWeight: "bold",
          }}>
          Payment Failed! 😔
        </h1>
        <p style={{ marginBottom: "20px", color: "#6c757d" }}>
          Unfortunately, your payment did not go through. Please try again or
          contact support for assistance.
        </p>
        <button
          onClick={handleBackToHome}
          style={{
            backgroundColor: "#007bff",
            color: "#ffffff",
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)", // Button shadow
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}>
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default PaymentErrorPage;
