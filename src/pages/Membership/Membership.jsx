import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate for navigation
import "./Membership.css";

function Membership() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  const fetchPackages = async () => {
    try {
      const response = await fetch("https://localhost:7196/api/packages");
      const data = await response.json();
      if (data.isSuccess && Array.isArray(data.result)) {
        setPackages(data.result);
      } else {
        console.error("Failed to fetch packages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  // Navigate to CouponPage with the selected packageId
  const handlePackageClick = (packageId) => {
    navigate(`/membership/coupon/${packageId}`);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="packages-container">
      {packages.length > 0 ? (
        packages.map((pkg) => (
          <div className="package-card" key={pkg.packageId}>
            <h2 className="package-name">{pkg.name}</h2>
            <p>
              <strong>Description:</strong> {pkg.description}
            </p>
            <p>
              <strong>Price:</strong> ${pkg.price} {pkg.currency}
            </p>
            <p>
              <strong>Term:</strong> {pkg.termInMonths} month(s)
            </p>
            <button
              onClick={() => handlePackageClick(pkg.packageId)}
              className="subscribe-button">
              Subscribe
            </button>
          </div>
        ))
      ) : (
        <p>Loading package data...</p>
      )}
    </div>
  );
}

export default Membership;
