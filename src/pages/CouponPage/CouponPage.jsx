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
      console.log(result);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to create receipt");
      }

      const receiptStatus = result?.result?.status;
      if (receiptStatus === "pending") {
        window.location.href = "http://localhost:5173/payment"; // Redirect to payment page
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
          paymentSessionUrl: "string", // The URL for the payment session (can be generated dynamically)
          approvedUrl: "http://localhost:5173/payment-success", // Approved URL
          cancelUrl:
            "https://drive.google.com/file/d/1BjNcczy3hcsiLWNdzywwM8ay30MLJdyR/view?usp=sharing", // Cancel URL
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
    <div>
      <h2>
        <i className="fas fa-gift"></i> Coupon Page
      </h2>
      <div>
        <p>
          <strong>Full Name: </strong> {fullName}
        </p>
      </div>
      {selectedPackage && (
        <div>
          <p>
            <strong>Name:</strong> {selectedPackage.name}
          </p>
          <p>
            <strong>Price:</strong> ${selectedPackage.price}
          </p>
          <p>
            <strong>Description:</strong> {selectedPackage.description}
          </p>
          <p></p>
        </div>
      )}
      <form onSubmit={handleCouponSubmit}>
        <div>
          <h3>Enter Coupon Code</h3>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code (optional)"
            disabled={loading}
          />
        </div>

        {/* Payment Method Selection */}
        <div>
          <h3>Select Payment Method</h3>
          <div>
            <label>
              <input
                type="radio"
                value="STRIPE"
                checked={paymentMethod === "STRIPE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Stripe
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                value="PAYOS"
                checked={paymentMethod === "PAYOS"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayOS
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? <i className="fas fa-spinner fa-spin"></i> : "Submit"}
        </button>
      </form>

      {error && (
        <p>
          <i className="fas fa-exclamation-circle"></i> {error}
        </p>
      )}
    </div>
  );
}

export default CouponPage;
