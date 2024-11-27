import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./CouponPage.css";

function CouponPage() {
  const { packageId } = useParams();
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("authToken");
  const [validationResult, setValidationResult] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to fetch the selected package details
  const fetchSelectedPackage = async () => {
    try {
      const response = await fetch(
        `https://cineworld.io.vn:7002/api/packages/${packageId}`
      );
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
      const response = await fetch(
        "https://cineworld.io.vn:7002/api/receipts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to create receipt");
      }

      const receiptStatus = result?.result?.status;
      if (receiptStatus === "pending") {
        window.location.href = "http://localhost:5173/payment";
      }

      localStorage.setItem("receiptId", result.result.receiptId);
      return result;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  // Function to create Stripe session
  const createStripeSession = async (stripeSessionData) => {
    try {
      const response = await fetch(
        "https://cineworld.io.vn:7002/api/receipts/CreateStripeSession",
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
        throw new Error(result?.message || "Failed to create Stripe session");
      }
      localStorage.setItem(
        "stripeSessionData",
        JSON.stringify(stripeSessionData)
      );
      return result;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const handleCouponSubmit = async () => {
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

    const stripeSessionData = {
      stripeSessionUrl: "string",
      stripeSessionId: "string",
      approvedUrl: "http://localhost:5173/payment-success",
      cancelUrl: "https://example.com/cancel",
      receiptId: newlyCreatedReceipt.receiptId,
    };

    const stripeSessionResponse = await createStripeSession(stripeSessionData);
    if (!stripeSessionResponse) {
      setLoading(false);
      return;
    }

    window.location.href = stripeSessionResponse.result.stripeSessionUrl;
  };

  return (
    <div className="coupon-page">
      <h2 className="h2">
        <i className="fas fa-gift"></i> Coupon Page
      </h2>
      {selectedPackage && (
        <div className="selected-package-details">
          <p>
            <strong>Name:</strong> {selectedPackage.name}{" "}
            <i className="fas fa-cogs"></i>
          </p>
          <p>
            <strong>Price:</strong> ${selectedPackage.price}{" "}
            <i className="fas fa-tag"></i>
          </p>
          <p>
            <strong>Description:</strong> {selectedPackage.description}{" "}
            <i className="fas fa-info-circle"></i>
          </p>
        </div>
      )}

      {/* Coupon Code Input */}
      <div className="coupon-input">
        <h3>
          <i className="fas fa-barcode"></i> Enter Coupon Code
        </h3>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code (optional)"
          disabled={loading}
        />
        <button onClick={handleCouponSubmit} disabled={loading}>
          {loading ? <i className="fas fa-spinner fa-spin"></i> : "Submit"}
        </button>
      </div>

      {error && (
        <p className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </p>
      )}
    </div>
  );
}

export default CouponPage;
