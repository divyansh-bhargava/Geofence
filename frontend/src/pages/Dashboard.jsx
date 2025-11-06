import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext"; // Import the context
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom User Icon
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Recenter map on user movement
function RecenterMap({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) map.setView([location.lat, location.lng], 15);
  }, [location, map]);
  return null;
}

function Dashboard() {
  const { isCollapsed } = useSidebar(); // Get collapse state
  const [userLocation, setUserLocation] = useState({
    lat: 28.6139,
    lng: 77.209,
  });
  const [geofences, setGeofences] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const token = localStorage.getItem("token");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🛰️ Track live user location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  // 🔄 Fetch active geofence(s)
  const fetchGeofences = async () => {
    try {
      const res = await fetch("/api/geofence/active", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.data) {
        const fenceArray = Array.isArray(data.data) ? data.data : [data.data];
        setGeofences(fenceArray);
      } else {
        setGeofences([]);
      }
    } catch (err) {
      console.error("Error fetching geofences:", err);
    }
  };

  // 🚨 Fetch recent alerts
  const fetchAlertsSummary = async () => {
    try {
      const res = await fetch("/api/alerts?page=1&limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAlertCount(data.data.length);
        setActivityFeed(data.data);
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  // Initial load and auto-refresh
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      await Promise.all([fetchGeofences(), fetchAlertsSummary()]);
      setLoading(false);
    };
    loadDashboard();

    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🚨 Panic button API
  const handlePanic = async () => {
    try {
      const res = await fetch("/api/geofence/panic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: userLocation.lat,
          longitude: userLocation.lng,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("🚨 Panic alert sent to trusted contacts!");
        fetchAlertsSummary();
      } else {
        alert("❌ Failed to send panic alert");
      }
    } catch (err) {
      console.error("Error triggering panic alert:", err);
      alert("⚠️ Panic alert failed due to network error.");
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "ENTRY":
        return "fa-door-open";
      case "EXIT":
        return "fa-door-closed";
      case "BREACH":
        return "fa-exclamation-triangle";
      case "PANIC":
        return "fa-bell";
      default:
        return "fa-info-circle";
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "ENTRY":
        return "text-green-400";
      case "EXIT":
        return "text-blue-400";
      case "BREACH":
        return "text-red-400";
      case "PANIC":
        return "text-yellow-400";
      default:
        return "text-purple-400";
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

      {/* Main content with dynamic left margin based on sidebar state */}
      <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <i className="fas fa-th-large mr-4 text-purple-400"></i>
                Dashboard Overview
              </h1>
              <p className="text-purple-200 text-sm">
                Real-time monitoring and security management
              </p>
            </div>
            <div className="text-right">
              <div className="text-white text-2xl font-semibold">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-purple-200 text-sm">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-6xl text-purple-400 mb-4"></i>
              <p className="text-white text-xl">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Geofences Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-draw-polygon text-white text-2xl"></i>
                  </div>
                  <span className="text-green-400 text-sm font-semibold flex items-center">
                    <i className="fas fa-arrow-up mr-1"></i>
                    Active
                  </span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {geofences.length}
                </div>
                <div className="text-purple-200 text-sm">Total Geofences</div>
              </div>

              {/* Active Geofences Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-shield-alt text-white text-2xl"></i>
                  </div>
                  <span className="text-green-400 text-sm font-semibold">
                    Live
                  </span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {geofences.filter((g) => g.isActive).length}
                </div>
                <div className="text-purple-200 text-sm">Active Zones</div>
              </div>

              {/* Alerts Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-red-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
                  </div>
                  <span className="text-red-400 text-sm font-semibold">
                    Recent
                  </span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {alertCount}
                </div>
                <div className="text-purple-200 text-sm">Alert Events</div>
              </div>

              {/* Location Status Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-location-dot text-white text-2xl"></i>
                  </div>
                  <span className="text-blue-400 text-sm font-semibold flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                    Live
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </div>
                <div className="text-purple-200 text-sm">Your Location</div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map Section - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <i className="fas fa-map-marked-alt mr-3 text-purple-400"></i>
                      Live Geofence Map
                    </h2>
                    <button
                      onClick={handlePanic}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      Emergency SOS
                    </button>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border-2 border-white/20 h-[500px]">
                    <MapContainer
                      center={[userLocation.lat, userLocation.lng]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <RecenterMap location={userLocation} />

                      <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={userIcon}
                      >
                        <Popup>📍 You are here</Popup>
                      </Marker>

                      {geofences.map((geo) => (
                        <Circle
                          key={geo._id}
                          center={[geo.latitude, geo.longitude]}
                          radius={geo.radius}
                          pathOptions={{
                            color: geo.isActive ? "#10b981" : "#ef4444",
                            fillColor: geo.isActive
                              ? "rgba(16, 185, 129, 0.2)"
                              : "rgba(239, 68, 68, 0.2)",
                            fillOpacity: 0.4,
                            weight: 3,
                          }}
                        >
                          <Popup>
                            <div className="text-gray-900">
                              <b>{geo.name}</b>
                              <br />
                              Radius: {geo.radius}m
                              <br />
                              Duration: {geo.duration}h
                              <br />
                              Status:{" "}
                              <span
                                className={
                                  geo.isActive
                                    ? "text-green-600 font-semibold"
                                    : "text-red-600 font-semibold"
                                }
                              >
                                {geo.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </Popup>
                        </Circle>
                      ))}
                    </MapContainer>
                  </div>

                  {/* Map Legend */}
                  <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-purple-200">Active Zone</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-purple-200">Inactive Zone</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-purple-200">Your Position</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Feed Section */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <i className="fas fa-bell mr-3 text-purple-400"></i>
                      Recent Activity
                    </h2>
                    <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs font-semibold">
                      Live
                    </span>
                  </div>

                  {activityFeed.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-inbox text-6xl text-purple-300/30 mb-4"></i>
                      <p className="text-purple-300 text-sm">
                        No recent activity found
                      </p>
                      <p className="text-purple-400/50 text-xs mt-2">
                        Events will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {activityFeed.map((alert, index) => (
                        <div
                          key={alert._id}
                          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:bg-white/10"
                          style={{
                            animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                                alert.type === "ENTRY"
                                  ? "from-green-500 to-emerald-600"
                                  : alert.type === "EXIT"
                                  ? "from-blue-500 to-cyan-600"
                                  : alert.type === "BREACH"
                                  ? "from-red-500 to-pink-600"
                                  : "from-yellow-500 to-orange-600"
                              } flex items-center justify-center flex-shrink-0`}
                            >
                              <i
                                className={`fas ${getAlertIcon(
                                  alert.type
                                )} text-white`}
                              ></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className={`font-semibold ${getAlertColor(
                                    alert.type
                                  )}`}
                                >
                                  {alert.type.replace("_", " ")}
                                </span>
                                <span className="text-purple-300 text-xs">
                                  {new Date(
                                    alert.createdAt
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-purple-200 text-sm break-words">
                                {alert.message || "No details available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(167, 139, 250, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(167, 139, 250, 0.7);
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
