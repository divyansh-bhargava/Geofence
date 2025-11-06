import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AlertTable() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // 📋 Fetch Alerts from Backend
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/alerts?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setAlerts(data.data);
      } else {
        toast.error(data.message || "⚠️ Failed to fetch alerts.");
      }
    } catch (err) {
      console.error("Fetch alerts error:", err);
      toast.error("⚠️ Network error while loading alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // ❌ Delete Alert
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
        toast.success("🗑️ Alert deleted successfully!");
        setAlerts((prev) => prev.filter((a) => a._id !== id));
      } else {
        toast.error(data.message || "Failed to delete alert.");
      }
    } catch (err) {
      console.error("Delete alert error:", err);
      toast.error("⚠️ Network error while deleting alert.");
    }
  };

  // Get alert type details
  const getAlertTypeDetails = (type) => {
    switch (type?.toLowerCase()) {
      case "panic":
        return {
          icon: "fa-bell",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          label: "Panic Alert",
        };
      case "geofence_breach":
      case "breach":
        return {
          icon: "fa-exclamation-triangle",
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          label: "Geofence Breach",
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
      case "ml_anomaly":
      case "anomaly":
        return {
          icon: "fa-brain",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30",
          label: "ML Anomaly",
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
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-6xl text-purple-400 mb-4"></i>
            <p className="text-white text-lg">Loading alerts...</p>
          </div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-inbox text-6xl text-purple-300/30 mb-4"></i>
          <p className="text-white text-xl mb-2">No alerts found</p>
          <p className="text-purple-300 text-sm">Alerts will appear here when triggered</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const typeDetails = getAlertTypeDetails(alert.type);
            return (
              <div
                key={alert._id}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-purple-400/50 transition-all duration-300"
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Alert Icon & Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 ${typeDetails.bgColor} rounded-xl flex items-center justify-center border ${typeDetails.borderColor} flex-shrink-0`}
                    >
                      <i className={`fas ${typeDetails.icon} ${typeDetails.color} text-xl`}></i>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span
                          className={`px-3 py-1 ${typeDetails.bgColor} ${typeDetails.color} text-xs font-semibold rounded-full border ${typeDetails.borderColor}`}
                        >
                          {typeDetails.label}
                        </span>
                        <span className="text-purple-300 text-xs">
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-white text-base font-medium mb-2">
                        {alert.message || "No message available"}
                      </p>

                      {alert.location && (
                        <div className="flex items-center gap-2 text-sm text-purple-200">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>
                            {alert.location.latitude?.toFixed(4)}, {alert.location.longitude?.toFixed(4)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteAlert(alert._id)}
                    className="px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-200 font-medium flex-shrink-0"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

export default AlertTable;
