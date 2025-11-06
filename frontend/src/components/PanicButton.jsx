import React from "react";
import { FaBell } from "react-icons/fa";
import "../styles/PanicButton.css";

function PanicButton() {
  const handlePanic = () => {
    alert("🚨 Panic Alert Sent!");
  };

  return (
    <div className="card panic-card">
      <h3>Emergency</h3>
      <button className="panic-btn" onClick={handlePanic}>
        <FaBell /> Panic Alert
      </button>
    </div>
  );
}

export default PanicButton;
