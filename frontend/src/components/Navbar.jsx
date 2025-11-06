import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaBell, FaCog } from "react-icons/fa";

function Navbar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">🛡️ IoT Security</h2>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaBell /> Alerts
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaCog /> Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Navbar;

