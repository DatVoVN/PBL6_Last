import React, { useState } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import "./CouponPage.css";

function CouponPage() {
  const { packageId } = useParams(); // Get packageId from URL
  const [couponCode, setCouponCode] = useState(""); // State to store the coupon code
  const [error, setError] = useState(""); // State to store error messages
  const [loading, setLoading] = useState(false); // Loading state to show while making requests

  // Function to create Receipt
  const createReceipt = async (data) => {
    try {
      const response = await fetch("https://localhost:7196/api/receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to create receipt");
      }
      return result;
    } catch (error) {
      console.error("Error creating receipt:", error);
      setError(error.message);
      return null; // Return null to indicate failure
    }
  };

  // Function to create Stripe session
  const createStripeSession = async (stripeSessionData) => {
    try {
      const response = await fetch(
        "https://localhost:7196/api/receipts/CreateStripeSession",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stripeSessionData),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to create Stripe session");
      }
      return result;
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      setError(error.message);
      return null;
    }
  };

  const validateStripeSession = async (validateStripeSessionData) => {
    try {
      const response = await fetch(
        "https://localhost:7196/api/receipts/ValidateStripeSession",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validateStripeSessionData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("API Response Errors:", result.errors);
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            console.error(
              `Field: ${key} - Errors: ${JSON.stringify(result.errors[key])}`
            );
          });
          setError("Validation failed. Check console for details.");
        } else {
          setError(result?.message || "An unknown error occurred");
        }
        return null; // Return null to indicate failure
      }

      return result; // Success
    } catch (error) {
      console.error("Error validating Stripe session:", error);
      setError("An error occurred while validating Stripe session.");
    }
  };

  // Handle coupon form submission
  const handleCouponSubmit = async () => {
    setError(""); // Reset any previous errors
    setLoading(true); // Set loading state to true

    const userId = Cookies.get("userId"); // Get user ID from cookies
    if (!userId) {
      setError("User is not logged in");
      setLoading(false);
      return;
    }

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
      approvedUrl: "http://localhost:5173/",
      cancelUrl:
        "https://drive.google.com/file/d/1BjNcczy3hcsiLWNdzywwM8ay30MLJdyR/view?usp=sharing",
      receipt: {
        receiptId: newlyCreatedReceipt.receiptId
          ? parseInt(newlyCreatedReceipt.receiptId, 10)
          : null, // Ensure it's a number
        userId: newlyCreatedReceipt.userId,
        packageId: newlyCreatedReceipt.packageId,
        couponCode: newlyCreatedReceipt.couponCode,
        discountAmount: newlyCreatedReceipt.discountAmount,
        packagePrice: newlyCreatedReceipt.packagePrice,
        termInMonths: newlyCreatedReceipt.termInMonths,
        createdDate: newlyCreatedReceipt.createdDate,
        status: newlyCreatedReceipt.status,
      },
    };

    console.log("receiptId:", newlyCreatedReceipt.receiptId);
    console.log(
      "parsed receiptId:",
      parseInt(newlyCreatedReceipt.receiptId, 10)
    );

    const stripeSessionResponse = await createStripeSession(stripeSessionData);
    if (!stripeSessionResponse) {
      setLoading(false);
      return;
    }

    window.open(stripeSessionResponse.result.stripeSessionUrl, "_blank");

    const validateStripeSessionData = {
      receiptId: parseInt(newlyCreatedReceipt.receiptId, 10), // Ensure this is passed as an integer
    };

    const validateResponse = await validateStripeSession(
      validateStripeSessionData
    );
    if (validateResponse?.isSuccess) {
      console.log("Stripe session validated successfully");
      console.log("Receipt:", validateResponse.result.Receipt);
      console.log("Membership:", validateResponse.result.Membership);
    } else {
      setError(
        `Failed to validate Stripe session: ${validateResponse?.message}`
      );
    }

    setLoading(false); // Set loading to false after all operations are complete
  };

  return (
    <div className="coupon-page">
      <h2>Enter Coupon Code</h2>
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Enter coupon code (optional)"
        disabled={loading} // Disable input during loading
      />
      <button onClick={handleCouponSubmit} disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CouponPage;
