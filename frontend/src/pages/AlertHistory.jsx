import React from "react";
import Sidebar from "../components/Sidebar";
import AlertTable from "../components/AlertTable";
import "../styles/AlertHistory.css";

function AlertHistory() {
  return (
    <div className="alert-history-container">
      <Sidebar />
      <main className="alert-history-main">
        <h2 className="page-title">Alert History</h2>
        <AlertTable />
      </main>
    </div>
  );
}

export default AlertHistory;


