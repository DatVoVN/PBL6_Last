import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function CouponPage() {
  const { packageId } = useParams();
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PAYOS"); // Default payment method
  const token = Cookies.get("authToken");
  const [validationResult, setValidationResult] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const MEMBERSHIP = import.meta.env.VITE_MEMBERSHIP;
  const fullName = Cookies.get("fullName");
  const userData = Cookies.get("userData");
  const [user, setUser] = useState(null);

  // Function to fetch the selected package details
  const fetchSelectedPackage = async () => {
    try {
      const response = await fetch(`${MEMBERSHIP}/api/packages/${packageId}`);
      const data = await response.json();
      if (data.isSuccess && data.result) {
        setSelectedPackage(data.result);
      } else {
        console.error("Failed to fetch selected package:", data.message);
      }
    } catch (error) {
      console.error("Error fetching selected package:", error);
    }
  };

  useEffect(() => {
    if (packageId) {
      fetchSelectedPackage();
    }
  }, [packageId]);

  // Function to create Receipt
  const createReceipt = async (data) => {
    try {
      const response = await fetch(`${MEMBERSHIP}/api/receipts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiptId: 0, // You can set it to 0 as it's not generated yet
          userId: data.userId, // Passing the userId
          email: "", // Can be fetched from user session or input field
          packageId: data.packageId,
          couponCode: data.couponCode || null,
          discountAmount: 0, // You can calculate if necessary
          packagePrice: selectedPackage?.price || 0, // Using selected package price
          termInMonths: 1, // Default term, can be updated based on selection
          createdDate: new Date().toISOString(),
          status: "pending", // or any other status
          stripeSessionId: "string", // Placeholder for Stripe session ID
          paymentMethod: paymentMethod, // Use selected payment method
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to create receipt- No has Coupon Code"
        );
      }

      const receiptStatus = result?.result?.status;
      if (receiptStatus === "pending") {
        window.location.href = "https://pbl-6-last.vercel.app/payment"; // Redirect to payment page
      }

      localStorage.setItem("receiptId", result.result.receiptId);
      return result;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  // Function to create payment session (Stripe or PayOS)
  const createPaymentSession = async (sessionData) => {
    try {
      const response = await fetch(`${MEMBERSHIP}/api/receipts/CreateSession`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiptId: sessionData.receiptId,
          paymentSessionUrl: "string",
          approvedUrl: "https://pbl-6-last.vercel.app/payment-success", // Approved URL
          cancelUrl: "https://pbl-6-last.vercel.app/payment-error", // Cancel URL
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to create payment session");
      }

      return result;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    setError("");
    setLoading(true);

    const userId = Cookies.get("userId");
    if (!userId) {
      setError("User is not logged in");
      setLoading(false);
      return;
    }

    localStorage.setItem("userId", userId);

    const data = {
      userId: userId,
      packageId: packageId,
      couponCode: couponCode || null,
    };

    const receiptResponse = await createReceipt(data);
    if (!receiptResponse) {
      setLoading(false);
      return;
    }

    const newlyCreatedReceipt = receiptResponse.result;

    const paymentSessionData = {
      receiptId: newlyCreatedReceipt.receiptId,
      // Additional session details can be included here
    };

    const sessionResponse = await createPaymentSession(paymentSessionData);
    if (!sessionResponse) {
      setLoading(false);
      return;
    }

    // Redirecting to payment session URL
    window.location.href = sessionResponse.result.paymentSessionUrl;
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "20px",
          color: "#007bff",
          marginBottom: "20px",
          borderBottom: "2px solid #007bff",
          paddingBottom: "10px",
        }}>
        <i
          className="fas fa-gift"
          style={{
            marginRight: "8px",
            color: "#ff4081",
          }}></i>
        Coupon Page
      </h2>

      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          padding: "10px",
          marginBottom: "15px",
          border: "1px solid #e0e0e0",
        }}>
        <p style={{ fontSize: "14px", margin: "0" }}>
          <i
            className="fas fa-user"
            style={{ marginRight: "6px", color: "#007bff" }}></i>
          <strong>Full Name: </strong> {fullName}
        </p>
      </div>

      {selectedPackage && (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #e0e0e0",
          }}>
          <p style={{ fontSize: "14px", margin: "5px 0" }}>
            <i
              className="fas fa-tag"
              style={{ marginRight: "6px", color: "#ff5722" }}></i>
            <strong>Name:</strong> {selectedPackage.name}
          </p>
          <p style={{ fontSize: "14px", margin: "5px 0" }}>
            <i
              className="fas fa-dollar-sign"
              style={{ marginRight: "6px", color: "#4caf50" }}></i>
            <strong>Price:</strong> ${selectedPackage.price}
          </p>
          <p style={{ fontSize: "14px", margin: "5px 0" }}>
            <i
              className="fas fa-info-circle"
              style={{ marginRight: "6px", color: "#ffc107" }}></i>
            <strong>Description:</strong> {selectedPackage.description}
          </p>
        </div>
      )}

      <form onSubmit={handleCouponSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <h3
            style={{
              marginBottom: "8px",
              fontSize: "16px",
              color: "#007bff",
            }}>
            <i
              className="fas fa-ticket-alt"
              style={{ marginRight: "6px", color: "#007bff" }}></i>
            Enter Coupon Code
          </h3>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon code (optional)"
            disabled={loading}
            style={{
              padding: "8px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h3
            style={{
              marginBottom: "8px",
              fontSize: "16px",
              color: "#007bff",
            }}>
            <i
              className="fas fa-credit-card"
              style={{ marginRight: "6px", color: "#007bff" }}></i>
            Payment Method
          </h3>
          <label
            style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}>
            <input
              type="radio"
              value="STRIPE"
              checked={paymentMethod === "STRIPE"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ marginRight: "6px" }}
            />
            <i
              className="fas fa-stripe"
              style={{ marginRight: "5px", color: "#635bff" }}></i>
            Stripe
          </label>
          <label style={{ display: "block", fontSize: "14px" }}>
            <input
              type="radio"
              value="PAYOS"
              checked={paymentMethod === "PAYOS"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ marginRight: "6px" }}
            />
            <i
              className="fas fa-wallet"
              style={{ marginRight: "5px", color: "#4caf50" }}></i>
            PayOS
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            color: "#fff",
            backgroundColor: loading ? "#ccc" : "#007bff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}>
          {loading ? (
            <i
              className="fas fa-spinner fa-spin"
              style={{ marginRight: "5px" }}></i>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {error && (
        <p
          style={{
            marginTop: "15px",
            color: "#ff0000",
            fontSize: "14px",
            textAlign: "center",
          }}>
          <i
            className="fas fa-exclamation-circle"
            style={{ marginRight: "6px" }}></i>
          {error}
        </p>
      )}
    </div>
  );
}

export default CouponPage;
