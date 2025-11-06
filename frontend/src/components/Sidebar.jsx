import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaCog, FaSignOutAlt, FaMapMarkerAlt, FaUserFriends, FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LogoutPopup from "./LogoutModal";

function Sidebar() {
  const [showLogout, setShowLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if route is active
  const isActive = (path) => location.pathname === path;

  // 🧹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogout(false);
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/geofence", icon: FaMapMarkerAlt, label: "Geofence" },
    { path: "/alerts", icon: FaBell, label: "Alerts" },
    { path: "/alert-history", icon: FaHistory, label: "Alert History" },
    { path: "/contacts", icon: FaUserFriends, label: "Contacts" },
    { path: "/profile", icon: FaCog, label: "Profile" },
  ];

  return (
    <>
      <aside className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 border-r border-white/10 flex flex-col transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}>
        
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-none">IoT Security</h2>
                <p className="text-purple-300 text-xs">Geo-Fencing</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 mx-auto">
              <i className="fas fa-shield-alt text-white text-xl"></i>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
        </button>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  active
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                    : "text-purple-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
                
                <Icon className={`text-xl flex-shrink-0 ${active ? "text-white" : "text-purple-400 group-hover:text-white"} transition-colors`} />
                
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl border border-white/10 z-50">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-white/10"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/10">
          <div className={`bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 mb-3 ${isCollapsed ? "flex justify-center" : ""}`}>
            {!isCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">User Name</p>
                  <p className="text-purple-300 text-xs truncate">user@example.com</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                U
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogout(true)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 border border-red-500/20 hover:border-red-500/40 group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <FaSignOutAlt className="text-xl flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl border border-white/10 z-50">
                Logout
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-white/10"></div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogout && (
        <LogoutPopup
          onClose={() => setShowLogout(false)}
          onConfirm={handleLogout}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(167, 139, 250, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(167, 139, 250, 0.5);
        }
      `}</style>
    </>
  );
}

export default Sidebar;
