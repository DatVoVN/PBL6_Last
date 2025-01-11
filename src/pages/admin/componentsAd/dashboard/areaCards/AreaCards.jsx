import React, { useState, useEffect } from "react";
import AreaCard from "./AreaCard";
import "./AreaCards.css";
import Cookies from "js-cookie";
const AreaCards = () => {
  // State to store membership data
  const [memberships, setMemberships] = useState(0);
  const [movies, setMovies] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  useEffect(() => {
    // Fetch membership data from the API
    const fetchMembershipData = async () => {
      try {
        const response = await fetch(
          "https://cineworld.io.vn:7002/api/memberships?PageNumber=1&PageSize=2000"
        );
        const data = await response.json();
        // Assuming the membership count is in the data.totalItems field (adjust if necessary)
        setMemberships(data.pagination.totalItems || 0);
      } catch (error) {
        console.error("Error fetching membership data:", error);
      }
    };

    fetchMembershipData();
  }, []);
  useEffect(() => {
    // Fetch membership data from the API
    const fetchMovieData = async () => {
      try {
        const response = await fetch(
          "https://cineworld.io.vn:7001/api/movies?PageNumber=1&PageSize=2000"
        );
        const data = await response.json();
        setMovies(data.pagination.totalItems || 0);
      } catch (error) {
        console.error("Error fetching movies data:", error);
      }
    };

    fetchMovieData();
  }, []);
  useEffect(() => {
    // Fetch total users with Bearer token
    const fetchUsers = async () => {
      const authToken = Cookies.get("authToken"); // Get authToken from cookies

      if (authToken) {
        try {
          const response = await fetch(
            "https://cineworld.io.vn:7000/api/users?PageNumber=1&PageSize=1000",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            // Assuming the total number of users is available in data.totalItems
            setTotalUsers(data.pagination.totalItems || 0);
          } else {
            console.error("Failed to fetch users:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        console.log("No authToken found.");
      }
    };

    fetchUsers();
  }, []);
  return (
    <div>
      <h2 className="area-top-title">Dashboard</h2>
      <section className="content-area-cards">
        <AreaCard
          colors={["#e4e8ef", "#475be8"]}
          percentFillValue={100}
          cardInfo={{
            title: "Total Movies",
            value: movies,
            text: `We have ${movies} items.`,
          }}
        />
        <AreaCard
          colors={["#4CAF50", "#8BC34A"]} // You can change these colors to any other color values
          percentFillValue={100} // Adjust the fill value as needed
          cardInfo={{
            title: "Total Users",
            value: totalUsers, // Display the fetched user count
            text: `Total number of users.`,
          }}
        />

        <AreaCard
          colors={["#e4e8ef", "#ff6347"]}
          percentFillValue={(memberships / totalUsers) * 100} // You can set the fill value based on other logic if needed
          cardInfo={{
            title: "Total Memberships",
            value: memberships, // Display the fetched membership count
            text: `Total number of memberships available is ${memberships}.`,
          }}
        />
      </section>
    </div>
  );
};

export default AreaCards;
