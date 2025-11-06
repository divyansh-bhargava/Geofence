import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../styles/MapView.css";

function MapView() {
  return (
    <div className="card map-card">
      <h3>
        <FaMapMarkerAlt /> Live Location & Geofence
      </h3>
      <div className="map-box">
        <p className="map-placeholder">[Map will be displayed here]</p>
      </div>
    </div>
  );
}

export default MapView;
