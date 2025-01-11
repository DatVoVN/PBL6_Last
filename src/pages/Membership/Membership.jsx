import React, { useEffect, useState } from "react";
import "./Membership.css";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

function Membership() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const MEMBERSHIP = import.meta.env.VITE_MEMBERSHIP;
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${MEMBERSHIP}/api/packages`);
      const data = await response.json();
      if (data.isSuccess && Array.isArray(data.result)) {
        setPackages(data.result);
      } else {
        console.error("Failed to fetch packages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(packages);

  useEffect(() => {
    fetchPackages();
  }, []);
  const handlePackageClick = (packageId) => {
    navigate(`/membership/coupon/${packageId}`);
  };
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="pricing-section">
      <h1 className="pricing-title">Convenient Pricing</h1>
      <p className="pricing-subtitle">
        Choose the right pricing for you and get started with your project.
      </p>
      <div className="pricing-cards">
        {packages.map((pkg) => (
          <div
            className={`pricing-card ${
              pkg.name === "Professional" ? "highlight" : ""
            }`}
            key={pkg.packageId}>
            <h2 className="package-name">{pkg.name}</h2>
            <h3 className="package-price">
              ${pkg.price}
              <span className="package-term">/{pkg.termInMonths} month</span>
            </h3>
            <p className="package-description">{pkg.description}</p>
            <ul className="package-features">
              <li>We are committed to giving you the best experience.</li>
              <li>A comfortable feeling when watching movies</li>
            </ul>
            <button
              className="subscribe-button"
              onClick={() => handlePackageClick(pkg.packageId)}>
              Get started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Membership;
