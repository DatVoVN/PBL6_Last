import React from "react";
import "./HeaderAd.css";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsJustify,
  BsPersonCircle,
  BsSearch,
} from "react-icons/bs";

function HeaderAd() {
  return (
    <div className="header">
      <div className="menu-icon">
        <BsJustify className="icon1" />
      </div>
      <div className="header-left">
        <BsSearch className="icon1" />
      </div>
      <div className="header right">
        <BsFillBellFill className="icon1" />
        <BsFillEnvelopeFill className="icon1" />
        <BsPersonCircle className="icon1" />
      </div>
    </div>
  );
}

export default HeaderAd;
