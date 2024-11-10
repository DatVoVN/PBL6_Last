import React from "react";
import "./TopViewProduct.css";
const TopViewProduct = () => {
  return (
    <div
      class="product__sidebar__view__item set-bg mix day years"
      style={{
        backgroundImage: `url(img/sidebar/tv-1.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top center",
      }}>
      <div class="ep">18 / ?</div>
      <div class="view">
        <i class="fa fa-eye"></i> 9141
      </div>
      <h5>
        <a href="#">Boruto: Naruto next generations</a>
      </h5>
    </div>
  );
};

export default TopViewProduct;
