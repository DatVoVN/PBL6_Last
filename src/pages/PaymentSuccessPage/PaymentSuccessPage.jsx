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
    <div className="success-container">
      <div className="success-message">
        <h1>Payment Successful! 🎉</h1>
        <p>
          Thank you for your purchase. Your payment was processed successfully.
        </p>
        <p>
          You can now enjoy your subscription. If you have any issues, feel free
          to contact our support team.
        </p>
        <button onClick={handleBackToHome}>Go to Home</button>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
