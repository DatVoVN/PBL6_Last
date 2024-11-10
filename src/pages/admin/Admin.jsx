import React from "react";
import "./Admin.css";
import { Outlet, Route, Router, Routes } from "react-router-dom";
import HeaderAd from "./AppLayout/HeaderAd";
import SidebarAd from "./AppLayout/SidebarAd";
function Admin() {
  return (
    <div className="grid-container">
      <HeaderAd />
      <SidebarAd />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
