import React, { useState } from "react";
import "../styles/GeofenceTable.css";

function GeofenceTable() {
  const [geofences, setGeofences] = useState([
    { id: 1, location: "Home", radius: "500m", status: true },
    { id: 2, location: "Office", radius: "300m", status: false },
  ]);

  const toggleStatus = (id) => {
    setGeofences(
      geofences.map((g) =>
        g.id === id ? { ...g, status: !g.status } : g
      )
    );
  };

  const deleteGeofence = (id) => {
    setGeofences(geofences.filter((g) => g.id !== id));
  };

  return (
    <div className="geofence-table-card">
      <h3>Existing Geofences</h3>
      <table className="geofence-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Radius</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {geofences.map((g) => (
            <tr key={g.id}>
              <td>{g.location}</td>
              <td>{g.radius}</td>
              <td>{g.status ? "On" : "Off"}</td>
              <td>
                <button onClick={() => toggleStatus(g.id)}>
                  {g.status ? "Turn Off" : "Turn On"}
                </button>
                <button onClick={() => deleteGeofence(g.id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GeofenceTable;
