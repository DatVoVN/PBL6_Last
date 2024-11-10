import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "./Poster.css";

const Poster = () => {
  const sliderItems = [
    {
      label: "Adventure",
      title: "Fate / Stay Night: Unlimited Blade Works",
      description: "After 30 days of travel across the world...",
      image: "img/hero/hero-1.jpg",
    },
    {
      label: "Adventure",
      title: "Fate / Stay Night: Unlimited Blade Works",
      description: "After 30 days of travel across the world...",
      image: "img/hero/hero-1.jpg",
    },
    {
      label: "Adventure",
      title: "Fate / Stay Night: Unlimited Blade Works",
      description: "After 30 days of travel across the world...",
      image: "img/hero/hero-1.jpg",
    },
  ];

  return (
    <section className="hero">
      <div className="container">
        <OwlCarousel
          className="hero__slider owl-theme"
          items={1}
          loop
          nav
          autoplay
          margin={10}
          navText={[
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>',
          ]}>
          {sliderItems.map((item, index) => (
            <div
              className="hero__items1 set-bg"
              style={{ backgroundImage: `url(${item.image})` }}
              key={index}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="hero__text1">
                    <div className="label">{item.label}</div>
                    <h2 className="h2-title">{item.title}</h2>
                    <p>{item.description}</p>
                    <a href="#">
                      <span>Watch Now</span>{" "}
                      <i className="fa fa-angle-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </OwlCarousel>
      </div>
    </section>
  );
};

export default Poster;
