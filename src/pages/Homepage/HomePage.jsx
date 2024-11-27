import React, { useState, useEffect } from "react";
import "./HomePage.css";
import TopViewProduct from "../../components/TopViewProduct/TopViewProduct";
import HeroSlider from "../../components/HeroSlider/HeroSlider";
import ListProduct from "../../components/ListProduct/ListProduct";
import Poster from "../../components/Poster/Poster";

const HomePage = () => {
  const [topViewedMovies, setTopViewedMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const response = await fetch("https://cineworld.io.vn:7001/api/movies");
      const data = await response.json();
      if (data.isSuccess) {
        const sortedMovies = data.result.sort((a, b) => b.view - a.view); // Sort by view count
        setTopViewedMovies(sortedMovies.slice(0, 4)); // Get top 4 movies
      } else {
        console.error("Failed to fetch movies:", data.message);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div style={{ backgroundColor: "#070720", paddingTop: "10px" }}>
      <div>
        <Poster />
      </div>
      <div style={{ paddingTop: "20px" }}>
        <HeroSlider />
      </div>

      <section className="product spad">
        <div className="custom-container">
          <div className="row">
            <div className="col-lg-9 col-md-8 fixed-left">
              <ListProduct />
            </div>
            <div
              className="col-lg-3 custom-sidebar"
              style={{ paddingRight: "-10px" }}>
              <div className="product__sidebar">
                <div className="product__sidebar__view">
                  <div className="section-title">
                    <h5>Top Views</h5>
                  </div>

                  <TopViewProduct movies={topViewedMovies} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
