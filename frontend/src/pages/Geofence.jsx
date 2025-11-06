import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 📍 Custom markers
const geoIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 28],
});
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [32, 32],
});

function Geofence() {
  const { isCollapsed } = useSidebar();
  const [userLocation, setUserLocation] = useState({ lat: 26.2183, lng: 78.1828 });
  const [geofences, setGeofences] = useState([]);
  const [form, setForm] = useState({
    name: "",
    lat: "",
    lng: "",
    radius: "",
    duration: 6,
    temperature: "",
    condition: "",
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🧭 Fetch user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, []);

  // 🔄 Load active geofences from backend
  const fetchActiveGeofences = async () => {
    try {
      const res = await fetch("/api/geofence/active", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeofences(Array.isArray(data.data) ? data.data : [data.data]);
      }
    } catch (err) {
      console.error("Error fetching geofences:", err);
    }
  };

  useEffect(() => {
    fetchActiveGeofences();
  }, []);

  // 📦 Create geofence
  const handleAddGeofence = async (e) => {
    e.preventDefault();
    setLoading(true);

    const latitude = parseFloat(form.lat);
    const longitude = parseFloat(form.lng);
    const radius = parseInt(form.radius, 10);
    const duration = parseInt(form.duration, 10);
    const temperature = parseFloat(form.temperature);

    if (!latitude || !longitude || !radius) {
      alert("⚠️ Please enter valid latitude, longitude, and radius.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/geofence/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name || `Geo-${Date.now()}`,
          latitude,
          longitude,
          radius,
          duration,
          weatherConditions: {
            temperature,
            condition: form.condition || "Clear",
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Geofence created successfully!");
        fetchActiveGeofences();
        setForm({
          name: "",
          lat: "",
          lng: "",
          radius: "",
          duration: 6,
          temperature: "",
          condition: "",
        });
      } else {
        alert("❌ Failed to create geofence.");
      }
    } catch (err) {
      console.error("Error creating geofence:", err);
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete geofence
  const deleteGeofence = async (id) => {
    if (!window.confirm("Are you sure you want to delete this geofence?")) return;
    
    try {
      const res = await fetch(`/api/geofence/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("🗑️ Geofence deleted successfully");
        fetchActiveGeofences();
      } else {
        alert("❌ Failed to delete geofence");
      }
    } catch (err) {
      console.error("Error deleting geofence:", err);
    }
  };

  // 🛰️ Check location
  const checkLocation = async () => {
    try {
      const res = await fetch("/api/geofence/check-location", {
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
      if (data.success && data.data.isInside) {
        alert(`🚨 You are inside the geofence: ${data.data.geofence.name}`);
      } else {
        alert("✅ You are outside any geofence.");
      }
    } catch (err) {
      console.error("Error checking location:", err);
    }
  };

  // 🚨 Trigger panic button
  const triggerPanic = async () => {
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
      } else {
        alert("❌ Failed to trigger panic alert.");
      }
    } catch (err) {
      console.error("Error triggering panic alert:", err);
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

      <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <i className="fas fa-draw-polygon mr-4 text-purple-400"></i>
                Manage Geofences
              </h1>
              <p className="text-purple-200 text-sm">
                Create and manage virtual boundaries with real-time monitoring
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
              <i className="fas fa-map-marker-alt text-green-400"></i>
              <span className="text-white text-sm font-medium">Active Zones: {geofences.filter(g => g.isActive).length}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-map-marked-alt text-white text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{geofences.length}</div>
            <div className="text-purple-200 text-sm">Total Geofences</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{geofences.filter(g => g.isActive).length}</div>
            <div className="text-purple-200 text-sm">Active Zones</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-red-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-ban text-white text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{geofences.filter(g => !g.isActive).length}</div>
            <div className="text-purple-200 text-sm">Inactive Zones</div>
          </div>
        </div>

        {/* Create Geofence Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 mb-8">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <i className="fas fa-plus-circle mr-3 text-purple-400"></i>
              Create New Geofence
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleAddGeofence} className="space-y-6">
              {/* Row 1: Name, Lat, Lng, Radius */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block">
                    <i className="fas fa-tag mr-2 text-purple-300"></i>
                    Geofence Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Home, Office"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block">
                    <i className="fas fa-map-pin mr-2 text-purple-300"></i>
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="26.2183"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block">
                    <i className="fas fa-map-marker-alt mr-2 text-purple-300"></i>
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="78.1828"
                    value={form.lng}
                    onChange={(e) => setForm({ ...form, lng: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block">
                    <i className="fas fa-ruler-combined mr-2 text-purple-300"></i>
                    Radius (meters)
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    value={form.radius}
                    onChange={(e) => setForm({ ...form, radius: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Duration, Temperature, Weather Condition */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block">
                    <i className="fas fa-clock mr-2 text-purple-300"></i>
                    Duration
                  </label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="6" className="bg-gray-900">6 hours</option>
                    <option value="12" className="bg-gray-900">12 hours</option>
                    <option value="24" className="bg-gray-900">24 hours</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block">
                    <i className="fas fa-temperature-high mr-2 text-purple-300"></i>
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="25.5"
                    value={form.temperature}
                    onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block">
                    <i className="fas fa-cloud-sun mr-2 text-purple-300"></i>
                    Weather Condition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Sunny, Rainy"
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Creating Geofence...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus mr-2"></i>
                    Create Geofence
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map & Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Map */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <i className="fas fa-globe mr-3 text-purple-400"></i>
                Interactive Map View
              </h2>
            </div>
            
            <div className="relative h-[500px] rounded-b-2xl overflow-hidden">
              <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                  <Popup>📍 You are here</Popup>
                </Marker>

                {geofences.map((geo) => (
                  <React.Fragment key={geo._id}>
                    <Marker position={[geo.latitude, geo.longitude]} icon={geoIcon}>
                      <Popup>
                        <div className="text-gray-900">
                          <b>{geo.name}</b>
                          <br />
                          Radius: {geo.radius}m
                          <br />
                          Duration: {geo.duration}h
                          <br />
                          Status: <span className={geo.isActive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{geo.isActive ? "Active" : "Inactive"}</span>
                        </div>
                      </Popup>
                    </Marker>
                    <Circle
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
                    />
                  </React.Fragment>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <i className="fas fa-tools mr-3 text-purple-400"></i>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={checkLocation}
                  className="w-full py-3 px-4 bg-blue-500/20 border-2 border-blue-400/30 text-blue-300 rounded-xl hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-200 font-semibold flex items-center justify-center"
                >
                  <i className="fas fa-crosshairs mr-2"></i>
                  Check My Location
                </button>
                
                <button
                  onClick={triggerPanic}
                  className="w-full py-3 px-4 bg-red-500/20 border-2 border-red-400/30 text-red-300 rounded-xl hover:bg-red-500/30 hover:border-red-400/50 transition-all duration-200 font-semibold flex items-center justify-center"
                >
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  🚨 Panic Alert
                </button>

                <button
                  onClick={fetchActiveGeofences}
                  className="w-full py-3 px-4 bg-green-500/20 border-2 border-green-400/30 text-green-300 rounded-xl hover:bg-green-500/30 hover:border-green-400/50 transition-all duration-200 font-semibold flex items-center justify-center"
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  Refresh Geofences
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <i className="fas fa-info-circle mr-3 text-purple-400"></i>
                Map Legend
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-purple-200">Active Geofence</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-purple-200">Inactive Geofence</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-purple-200">Your Position</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geofences List */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <i className="fas fa-list mr-3 text-purple-400"></i>
              Active Geofences
            </h2>
          </div>
          
          {geofences.length === 0 ? (
            <div className="p-12 text-center">
              <i className="fas fa-map-marked-alt text-6xl text-purple-300/30 mb-4"></i>
              <p className="text-white text-xl mb-2">No geofences created yet</p>
              <p className="text-purple-300 text-sm">Create your first geofence using the form above</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {geofences.map((geo) => (
                  <div
                    key={geo._id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 ${geo.isActive ? "bg-green-500/20" : "bg-red-500/20"} rounded-xl flex items-center justify-center`}>
                            <i className={`fas fa-circle ${geo.isActive ? "text-green-400" : "text-red-400"}`}></i>
                          </div>
                          <div>
                            <h3 className="text-white text-xl font-semibold">{geo.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${geo.isActive ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                              {geo.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-purple-300 mb-1"><i className="fas fa-map-pin mr-2"></i>Coordinates</p>
                            <p className="text-white font-semibold">{geo.latitude.toFixed(4)}, {geo.longitude.toFixed(4)}</p>
                          </div>
                          <div>
                            <p className="text-purple-300 mb-1"><i className="fas fa-ruler-combined mr-2"></i>Radius</p>
                            <p className="text-white font-semibold">{geo.radius} meters</p>
                          </div>
                          <div>
                            <p className="text-purple-300 mb-1"><i className="fas fa-clock mr-2"></i>Duration</p>
                            <p className="text-white font-semibold">{geo.duration} hours</p>
                          </div>
                          <div>
                            <p className="text-purple-300 mb-1"><i className="fas fa-calendar-times mr-2"></i>Expires At</p>
                            <p className="text-white font-semibold">{new Date(geo.expiresAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteGeofence(geo._id)}
                        className="px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-200 font-medium"
                      >
                        <i className="fas fa-trash mr-2"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Geofence;
