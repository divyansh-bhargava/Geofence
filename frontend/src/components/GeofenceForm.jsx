import React, { useState } from "react";
import "../styles/GeofenceForm.css";

function GeofenceForm() {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Geofence:", { location, radius });
    setLocation("");
    setRadius("");
  };

  return (
    <div className="geofence-form-card">
      <h3>Add New Geofence</h3>
      <form onSubmit={handleSubmit} className="geofence-form">
        <input
          type="text"
          placeholder="Enter location name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Enter radius (meters)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          required
        />
        <button type="submit">Add Geofence</button>
      </form>
    </div>
  );
}

export default GeofenceForm;
