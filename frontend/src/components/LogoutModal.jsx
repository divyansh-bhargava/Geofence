import React from "react";
import "../styles/LogoutModal.css";

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div
        className="logout-modal"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>
        <div className="logout-modal-actions">
          <button onClick={onConfirm} className="confirm-btn">
            Yes, Logout
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;