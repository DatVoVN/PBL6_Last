import React from "react";
import "./HomePage.css";
import TopViewProduct from "../../components/TopViewProduct/TopViewProduct";
import HeroSlider from "../../components/HeroSlider/HeroSlider";
import ListProduct from "../../components/ListProduct/ListProduct";
import Poster from "../../components/Poster/Poster";

const HomePage = () => {
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
                </div>
                <TopViewProduct />
                <TopViewProduct />
                <TopViewProduct />
                <TopViewProduct />
                <TopViewProduct />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
