import React, { useState, useEffect } from "react";
import "./HomePage.css";
import TopViewProduct from "../../components/TopViewProduct/TopViewProduct";
import HeroSlider from "../../components/HeroSlider/HeroSlider";
import ListProduct from "../../components/ListProduct/ListProduct";
import Poster from "../../components/Poster/Poster";
const MOVIE = import.meta.env.VITE_MOVIE;
const HomePage = () => {
  const [topViewedMovies, setTopViewedMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `${MOVIE}/api/movies?OrderBy=-View&PageNumber=1&PageSize=4`
      );
      const data = await response.json();
      if (data.isSuccess) {
        setTopViewedMovies(data.result);
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
    <div
      style={{ backgroundColor: "#070720", paddingTop: "10px", width: "100%" }}>
      <div>
        <Poster />
      </div>
      <div style={{ paddingTop: "20px" }}>
        <HeroSlider />
      </div>

      <section className="product spad">
        <div className="custom-container">
          <div className="row" style={{ margin: "20px" }}>
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
