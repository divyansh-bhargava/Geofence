import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/Geofence.css";

// Custom marker
const geoIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 28],
});
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [32, 32],
});

function Geofence() {
  const [userLocation] = useState({ lat: 26.2183, lng: 78.1828 });

  const [geofences, setGeofences] = useState([]);
  const [form, setForm] = useState({
    name: "",
    lat: "",
    lng: "",
    radius: "",
  });

  // 🔍 Geocode location name → lat/lng
  const geocodeLocation = async (name) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${name}`
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      } else {
        alert("⚠️ Location not found!");
        return null;
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  // ➕ Add Geofence
  const handleAddGeofence = async (e) => {
    e.preventDefault();
    let lat = form.lat ? parseFloat(form.lat) : null;
    let lng = form.lng ? parseFloat(form.lng) : null;

    // If no lat/lng but name given → geocode
    if ((!lat || !lng) && form.name) {
      const coords = await geocodeLocation(form.name);
      if (!coords) return;
      lat = coords.lat;
      lng = coords.lng;
    }

    if (!lat || !lng || !form.radius) {
      alert("⚠️ Please enter valid location or lat/lng with radius.");
      return;
    }

    const newGeo = {
      id: Date.now(),
      name: form.name || `Geo-${Date.now()}`,
      lat,
      lng,
      radius: parseInt(form.radius, 10),
      status: "On",
    };

    setGeofences((prev) => [...prev, newGeo]);
    setForm({ name: "", lat: "", lng: "", radius: "" });
  };

  // Toggle status
  const toggleStatus = (id) => {
    setGeofences((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, status: g.status === "On" ? "Off" : "On" } : g
      )
    );
  };

  // Delete geofence
  const deleteGeofence = (id) => {
    setGeofences((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="geofence-container">
      <Sidebar />
      <main className="geofence-main">
        <h2 className="page-title">Manage Geofences</h2>

        {/* Geofence Form */}
        <form className="geofence-form" onSubmit={handleAddGeofence}>
          <input
            type="text"
            placeholder="Location Name (optional)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
          />
          <input
            type="number"
            placeholder="Radius (meters)"
            value={form.radius}
            onChange={(e) => setForm({ ...form, radius: e.target.value })}
            required
          />
          <button type="submit">Add Geofence</button>
        </form>

        {/* Map */}
        <div className="map-section">
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            className="map-box"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* User Marker */}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>📍 You are here</Popup>
            </Marker>

            {/* Geofences */}
            {geofences.map((geo) => (
              <React.Fragment key={geo.id}>
                <Marker position={[geo.lat, geo.lng]} icon={geoIcon}>
                  <Popup>
                    <b>{geo.name}</b>
                    <br />
                    Radius: {geo.radius}m
                  </Popup>
                </Marker>
                <Circle
                  center={[geo.lat, geo.lng]}
                  radius={geo.radius}
                  pathOptions={{
                    color: geo.status === "On" ? "lime" : "red",
                    fillColor:
                      geo.status === "On"
                        ? "rgba(0,255,0,0.3)"
                        : "rgba(255,0,0,0.3)",
                  }}
                />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        {/* Geofence Table */}
        <table className="geofence-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Radius</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {geofences.map((geo) => (
              <tr key={geo.id}>
                <td>{geo.name}</td>
                <td>{geo.lat.toFixed(4)}</td>
                <td>{geo.lng.toFixed(4)}</td>
                <td>{geo.radius} m</td>
                <td>{geo.status}</td>
                <td>
                  <button onClick={() => toggleStatus(geo.id)}>
                    {geo.status === "On" ? "Turn Off" : "Turn On"}
                  </button>
                  <button onClick={() => deleteGeofence(geo.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Geofence;
