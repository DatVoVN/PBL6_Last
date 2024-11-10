import React from "react";
import "./TopCommentProduct.css";
const TopCommentProduct = () => {
  return (
    <div class="product__sidebar__comment__item">
      <div class="product__sidebar__comment__item__pic">
        <img src="img/sidebar/comment-1.jpg" alt="" />
      </div>
      <div class="product__sidebar__comment__item__text">
        <ul>
          <li>Active</li>
          <li>Movie</li>
        </ul>
        <h5>
          <a href="#">The Seven Deadly Sins: Wrath of the Gods</a>
        </h5>
        <span>
          <i class="fa fa-eye"></i> 19.141 Viewes
        </span>
      </div>
    </div>
  );
};

export default TopCommentProduct;
