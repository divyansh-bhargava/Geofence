import React from "react";
import Sidebar from "../components/Sidebar";
import ContactForm from "../components/ContactForm";
import ContactTable from "../components/ContactTable.jsx";
import { useSidebar } from "../context/SidebarContext";

function Contacts() {
  const { isCollapsed } = useSidebar();

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
                <i className="fas fa-users mr-4 text-purple-400"></i>
                Manage Contacts
              </h1>
              <p className="text-purple-200 text-sm">
                Add and manage emergency contacts for alerts and notifications
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
              <i className="fas fa-info-circle text-blue-400"></i>
              <span className="text-white text-sm font-medium">Total Contacts: 0</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-user-friends text-white text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-purple-200 text-sm">Total Contacts</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-white text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-purple-200 text-sm">Active Contacts</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-bell text-white text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-purple-200 text-sm">Notifications Sent</div>
          </div>
        </div>

        {/* Add Contact Form Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 mb-8">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <i className="fas fa-user-plus mr-3 text-purple-400"></i>
              Add New Contact
            </h2>
          </div>
          
          <div className="p-6">
            <ContactForm />
          </div>
        </div>

        {/* Contacts Table Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <i className="fas fa-address-book mr-3 text-purple-400"></i>
                Contact List
              </h2>
              
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="px-4 py-2 pl-10 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-purple-300"></i>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <ContactTable />
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Methods */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <i className="fas fa-paper-plane mr-3 text-purple-400"></i>
              Notification Methods
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-blue-400"></i>
                  </div>
                  <span className="text-white font-medium">Email</span>
                </div>
                <span className="text-green-400 text-sm">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-sms text-green-400"></i>
                  </div>
                  <span className="text-white font-medium">SMS</span>
                </div>
                <span className="text-green-400 text-sm">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-phone text-purple-400"></i>
                  </div>
                  <span className="text-white font-medium">Phone Call</span>
                </div>
                <span className="text-green-400 text-sm">Active</span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <i className="fas fa-lightbulb mr-3 text-purple-400"></i>
              Quick Tips
            </h3>
            <div className="space-y-3 text-purple-200 text-sm">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                <i className="fas fa-check-circle text-green-400 mt-1"></i>
                <p>Add multiple contacts for redundancy in emergency situations</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                <i className="fas fa-check-circle text-green-400 mt-1"></i>
                <p>Keep contact information up-to-date for reliable notifications</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                <i className="fas fa-check-circle text-green-400 mt-1"></i>
                <p>Test notification delivery regularly to ensure system reliability</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contacts;
