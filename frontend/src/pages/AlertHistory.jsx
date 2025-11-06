import React from "react";
import Sidebar from "../components/Sidebar";
import AlertTable from "../components/AlertTable";
import { useSidebar } from "../context/SidebarContext"; // Import context

function AlertHistory() {
  const { isCollapsed } = useSidebar(); // Get collapse state

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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <i className="fas fa-history mr-4 text-purple-400"></i>
                Alert History
              </h1>
              <p className="text-purple-200 text-sm">
                Complete history of all security alerts and events
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl text-white hover:bg-white/15 hover:border-purple-400/50 transition-all duration-300 flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center">
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-white text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-purple-200 text-sm">Total Alerts</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-white text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-purple-200 text-sm">Resolved</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-bell text-white text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-purple-200 text-sm">Critical</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-clock text-white text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-purple-200 text-sm">Last 24h</div>
          </div>
        </div>

        {/* Alert Table Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <i className="fas fa-list mr-3 text-purple-400"></i>
              Alert Records
            </h2>
          </div>
          
          <div className="p-6">
            <AlertTable />
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Filters */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <i className="fas fa-filter mr-3 text-purple-400"></i>
              Quick Filters
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-purple-200 hover:bg-white/10 hover:border-purple-400/50 transition-all text-left flex items-center justify-between">
                <span><i className="fas fa-exclamation-triangle mr-2 text-red-400"></i> Critical Alerts</span>
                <span className="text-xs bg-red-500/20 px-2 py-1 rounded-full">0</span>
              </button>
              <button className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-purple-200 hover:bg-white/10 hover:border-purple-400/50 transition-all text-left flex items-center justify-between">
                <span><i className="fas fa-bell mr-2 text-yellow-400"></i> Panic Alerts</span>
                <span className="text-xs bg-yellow-500/20 px-2 py-1 rounded-full">0</span>
              </button>
              <button className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-purple-200 hover:bg-white/10 hover:border-purple-400/50 transition-all text-left flex items-center justify-between">
                <span><i className="fas fa-door-open mr-2 text-green-400"></i> Geofence Events</span>
                <span className="text-xs bg-green-500/20 px-2 py-1 rounded-full">0</span>
              </button>
              <button className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-purple-200 hover:bg-white/10 hover:border-purple-400/50 transition-all text-left flex items-center justify-between">
                <span><i className="fas fa-brain mr-2 text-purple-400"></i> ML Anomalies</span>
                <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full">0</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <i className="fas fa-chart-line mr-3 text-purple-400"></i>
              Activity Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-purple-200 text-sm">Today</span>
                <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{width: '0%'}}></div>
                </div>
                <span className="text-white font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200 text-sm">This Week</span>
                <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{width: '0%'}}></div>
                </div>
                <span className="text-white font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200 text-sm">This Month</span>
                <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" style={{width: '0%'}}></div>
                </div>
                <span className="text-white font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200 text-sm">All Time</span>
                <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full" style={{width: '0%'}}></div>
                </div>
                <span className="text-white font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AlertHistory;
