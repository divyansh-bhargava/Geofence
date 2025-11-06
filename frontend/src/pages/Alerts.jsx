import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const token = localStorage.getItem("token");

  // 🔄 Fetch alerts from backend
  const fetchAlerts = async (pageNum = 1, type = "") => {
    setLoading(true);
    try {
      const url = `/api/alerts?page=${pageNum}&limit=10${
        type ? `&type=${type}` : ""
      }`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setAlerts(data.data);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch alerts:", data.message);
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(page, filterType);
  }, [page, filterType]);

  // 📄 View single alert details
  const viewAlertDetails = async (id) => {
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setSelectedAlert(data.data);
      } else {
        alert("❌ Failed to fetch alert details");
      }
    } catch (err) {
      console.error("Error fetching alert details:", err);
    }
  };

  // ❌ Delete an alert
  const deleteAlert = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        alert("🗑️ Alert deleted successfully");
        fetchAlerts(page, filterType);
      } else {
        alert("❌ Failed to delete alert");
      }
    } catch (err) {
      console.error("Error deleting alert:", err);
    }
  };

  // Get alert type details
  const getAlertTypeDetails = (type) => {
    switch (type?.toLowerCase()) {
      case "geofence_breach":
      case "breach":
        return {
          icon: "fa-exclamation-triangle",
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          label: "Breach",
        };
      case "panic":
        return {
          icon: "fa-bell",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          label: "Panic",
        };
      case "ml_anomaly":
      case "anomaly":
        return {
          icon: "fa-brain",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30",
          label: "ML Anomaly",
        };
      case "entry":
        return {
          icon: "fa-door-open",
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          label: "Entry",
        };
      case "exit":
        return {
          icon: "fa-door-closed",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
          label: "Exit",
        };
      default:
        return {
          icon: "fa-info-circle",
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          label: type || "Unknown",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex">
      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <i className="fas fa-history mr-4 text-purple-400"></i>
                Alert History
              </h1>
              <p className="text-purple-200 text-sm">
                Monitor and manage security alerts and notifications
              </p>
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(1);
                }}
                className="appearance-none px-6 py-3 pr-12 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all cursor-pointer hover:bg-white/15"
              >
                <option value="" className="bg-gray-900">All Types</option>
                <option value="geofence_breach" className="bg-gray-900">Geofence Breach</option>
                <option value="panic" className="bg-gray-900">Panic Button</option>
                <option value="ml_anomaly" className="bg-gray-900">ML Anomaly</option>
                <option value="entry" className="bg-gray-900">Entry</option>
                <option value="exit" className="bg-gray-900">Exit</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 pointer-events-none"></i>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm mb-2">Total Alerts</p>
                <p className="text-3xl font-bold text-white">{pagination.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-bell text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm mb-2">Current Page</p>
                <p className="text-3xl font-bold text-white">{pagination.page} / {pagination.pages}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-file-alt text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm mb-2">Showing Results</p>
                <p className="text-3xl font-bold text-white">{alerts.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-list text-white text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Content */}
        {loading ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
            <i className="fas fa-spinner fa-spin text-6xl text-purple-400 mb-4"></i>
            <p className="text-white text-xl">Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
            <i className="fas fa-inbox text-6xl text-purple-300/30 mb-4"></i>
            <p className="text-white text-xl mb-2">No alerts found</p>
            <p className="text-purple-300 text-sm">Try adjusting your filter or check back later</p>
          </div>
        ) : (
          <>
            {/* Alerts List - Card View */}
            <div className="space-y-4">
              {alerts.map((alert, index) => {
                const typeDetails = getAlertTypeDetails(alert.type);
                return (
                  <div
                    key={alert._id || index}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Alert Icon & Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-14 h-14 ${typeDetails.bgColor} rounded-xl flex items-center justify-center border ${typeDetails.borderColor} flex-shrink-0`}
                        >
                          <i className={`fas ${typeDetails.icon} ${typeDetails.color} text-2xl`}></i>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`px-3 py-1 ${typeDetails.bgColor} ${typeDetails.color} text-xs font-semibold rounded-full border ${typeDetails.borderColor}`}
                            >
                              {typeDetails.label}
                            </span>
                            <span className="text-purple-300 text-sm">
                              #{index + 1 + (pagination.page - 1) * 10}
                            </span>
                          </div>

                          <p className="text-white text-lg font-semibold mb-2">
                            {alert.message || "No message available"}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-purple-200">
                            <span className="flex items-center">
                              <i className="far fa-clock mr-2"></i>
                              {new Date(alert.createdAt).toLocaleString() || "Unknown Time"}
                            </span>
                            {alert.location && (
                              <span className="flex items-center">
                                <i className="fas fa-map-marker-alt mr-2"></i>
                                {alert.location.latitude?.toFixed(4)}, {alert.location.longitude?.toFixed(4)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => viewAlertDetails(alert._id)}
                          className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-200 font-medium"
                        >
                          <i className="fas fa-eye mr-2"></i>
                          View
                        </button>
                        <button
                          onClick={() => deleteAlert(alert._id)}
                          className="px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-200 font-medium"
                        >
                          <i className="fas fa-trash mr-2"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <i className="fas fa-chevron-left mr-2"></i>
                  Previous
                </button>

                <span className="text-white font-medium">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <i className="fas fa-chevron-right ml-2"></i>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Alert Details Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 rounded-3xl p-8 max-w-2xl w-full border-2 border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-white flex items-center">
                  <i className="fas fa-info-circle mr-3 text-purple-400"></i>
                  Alert Details
                </h3>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-xl transition-all duration-200 flex items-center justify-center"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                  <p className="text-purple-300 text-sm mb-1">Alert Type</p>
                  <p className="text-white text-lg font-semibold">
                    {selectedAlert.type || "Unknown"}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                  <p className="text-purple-300 text-sm mb-1">Message</p>
                  <p className="text-white text-lg">
                    {selectedAlert.message || "No message available"}
                  </p>
                </div>

                {selectedAlert.location && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                      <p className="text-purple-300 text-sm mb-1">Latitude</p>
                      <p className="text-white text-lg font-mono">
                        {selectedAlert.location.latitude}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                      <p className="text-purple-300 text-sm mb-1">Longitude</p>
                      <p className="text-white text-lg font-mono">
                        {selectedAlert.location.longitude}
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                  <p className="text-purple-300 text-sm mb-1">Created At</p>
                  <p className="text-white text-lg">
                    {new Date(selectedAlert.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedAlert.sentTo && selectedAlert.sentTo.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                    <p className="text-purple-300 text-sm mb-3">Notifications Sent To</p>
                    <ul className="space-y-2">
                      {selectedAlert.sentTo.map((contact, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10"
                        >
                          <span className="text-white">
                            <i className="fas fa-paper-plane mr-2 text-blue-400"></i>
                            {contact.method}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              contact.status === "sent"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            {contact.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <button
                onClick={() => setSelectedAlert(null)}
                className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-200"
              >
                <i className="fas fa-times mr-2"></i>
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Alerts;
