import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./CouponPage.css";

function CouponPage() {
  const { packageId } = useParams(); // Get packageId from URL
  const [couponCode, setCouponCode] = useState(""); // State to store the coupon code
  const [error, setError] = useState(""); // State to store error messages
  const [loading, setLoading] = useState(false); // Loading state to show while making requests
  const token = Cookies.get("authToken"); // Get token from cookies
  const [validationResult, setValidationResult] = useState(null); // New state to display validation result
  const navigate = useNavigate(); // For navigating programmatically
  const location = useLocation(); // To get the current location (URL)

  // Function to create Receipt
  const createReceipt = async (data) => {
    try {
      const response = await fetch("https://localhost:7002/api/receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("Error creating receipt:", result);
        throw new Error(result?.message || "Failed to create receipt");
      }

      // Store receiptId in localStorage
      localStorage.setItem("receiptId", result.result.receiptId);

      return result;
    } catch (error) {
      console.error("Error creating receipt:", error);
      setError(error.message);
      return null;
    }
  };

  // Function to create Stripe session
  const createStripeSession = async (stripeSessionData) => {
    try {
      const response = await fetch(
        "https://localhost:7002/api/receipts/CreateStripeSession",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(stripeSessionData),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        console.error("API Error Response:", result);
        throw new Error(result?.message || "Failed to create Stripe session");
      }

      // Store the entire stripeSessionData object in localStorage
      localStorage.setItem(
        "stripeSessionData",
        JSON.stringify(stripeSessionData)
      );
      return result;
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      setError(error.message);
      return null;
    }
  };

  const validateStripeSession = async (receiptId) => {
    try {
      const response = await fetch(
        `https://localhost:7002/api/receipts/ValidateStripeSession/${receiptId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${token}`,
          },
          body: null,
        }
      );

      const result = await response.json(); // Expecting JSON response
      if (!response.ok || !result.isSuccess) {
        console.error(
          "Validation error:",
          result.message || "Failed to validate"
        );
        throw new Error(result.message || "Failed to validate Stripe session");
      }

      console.log("Validation successful:", result.message); // Log the message
      setValidationResult(
        result.message || "Session validation was successful"
      ); // Set a user-friendly message
      alert("Validation successful: " + result.message); // Display success alert
      return result;
    } catch (error) {
      console.error("Error validating Stripe session:", error);
      setError(error.message);
    }
  };

  const handleCouponSubmit = async () => {
    setError(""); // Reset any previous errors
    setLoading(true); // Set loading state to true

    const userId = Cookies.get("userId"); // Get user ID from cookies
    if (!userId) {
      setError("User is not logged in");
      setLoading(false);
      return;
    }

    // Store userId in localStorage
    localStorage.setItem("userId", userId);

    const data = {
      userId: userId,
      packageId: packageId,
      couponCode: couponCode || null,
    };

    // Step 1: Create receipt
    const receiptResponse = await createReceipt(data);
    if (!receiptResponse) {
      setLoading(false);
      return;
    }

    const newlyCreatedReceipt = receiptResponse.result;
    console.log("Receipt created with ID:", newlyCreatedReceipt.receiptId); // Log receiptId

    // Step 2: Create Stripe session data
    const stripeSessionData = {
      stripeSessionUrl: "string",
      stripeSessionId: "string",
      approvedUrl: "http://localhost:5173",
      cancelUrl:
        "https://drive.google.com/file/d/1BjNcczy3hcsiLWNdzywwM8ay30MLJdyR/view?usp=sharing",
      receiptId: newlyCreatedReceipt.receiptId,
    };

    console.log("stripeSessionData with receiptId:", stripeSessionData);

    // Step 3: Create Stripe session
    const stripeSessionResponse = await createStripeSession(stripeSessionData);
    if (!stripeSessionResponse) {
      setLoading(false);
      return;
    }

    // Redirect user to the Stripe session URL
    window.location.href = stripeSessionResponse.result.stripeSessionUrl;
  };

  // Check if we're on the approvedUrl and validate Stripe session
  useEffect(() => {
    const currentUrl = window.location.href;
    const approvedUrl = "http://localhost:5173";

    // If the current URL matches the approvedUrl, validate the session
    if (currentUrl.includes(approvedUrl)) {
      const receiptId = localStorage.getItem("receiptId");
      if (receiptId) {
        console.log("Validating Stripe session with receiptId:", receiptId);
        validateStripeSession(receiptId); // Validate using receiptId from localStorage
      }
    }
  }, [location]);

  return (
    <div className="coupon-page">
      <h2>Enter Coupon Code</h2>
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Enter coupon code (optional)"
        disabled={loading}
      />
      <button onClick={handleCouponSubmit} disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CouponPage;
