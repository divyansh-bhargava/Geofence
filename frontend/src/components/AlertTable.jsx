import React, { useState } from "react";
import "../styles/AlertTable.css";

function AlertTable() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: "Panic Button", time: "2025-09-09 14:32", status: "Sent" },
    { id: 2, type: "Geofence Breach", time: "2025-09-08 19:12", status: "Delivered" },
    { id: 3, type: "Stress Level High", time: "2025-09-08 07:45", status: "Pending" },
  ]);

  const deleteAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="alert-table-card">
      <table className="alert-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a.id}>
              <td>{a.type}</td>
              <td>{a.time}</td>
              <td>
                <span
                  className={`status-badge ${
                    a.status === "Sent"
                      ? "sent"
                      : a.status === "Delivered"
                      ? "delivered"
                      : "pending"
                  }`}
                >
                  {a.status}
                </span>
              </td>
              <td>
                <button onClick={() => deleteAlert(a.id)} className="delete-btn">
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

export default AlertTable;
