import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContactForm({ onContactAdded }) {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);

  // ➕ Add new contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.name || (!form.email && !form.mobile)) {
      toast.warning("⚠️ Name and at least one contact method are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Contact added successfully!");
        setForm({ name: "", email: "", mobile: "" });
        if (onContactAdded) onContactAdded(); // refresh contact table
      } else {
        toast.error(data.message || "Failed to add contact.");
      }
    } catch (err) {
      console.error("Add contact error:", err);
      toast.error("⚠️ Network error while adding contact.");
    } finally {
      setLoading(false);
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
      
      <form onSubmit={handleAddContact} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-100 block">
            <i className="fas fa-user mr-2 text-purple-300"></i>
            Contact Name *
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fas fa-user-circle text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
            </div>
            <input
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-100 block">
            <i className="fas fa-envelope mr-2 text-purple-300"></i>
            Email Address
            <span className="text-purple-400 text-xs ml-2">(Optional)</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fas fa-at text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
            </div>
            <input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
            />
          </div>
        </div>

        {/* Mobile Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-100 block">
            <i className="fas fa-phone mr-2 text-purple-300"></i>
            Mobile Number
            <span className="text-purple-400 text-xs ml-2">(Optional)</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fas fa-mobile-alt text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
            </div>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
            />
          </div>
        </div>

        {/* Info Message */}
        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
          <i className="fas fa-info-circle text-blue-400 text-lg mt-0.5"></i>
          <p className="text-sm text-blue-200">
            <strong>Note:</strong> At least one contact method (email or mobile) is required for emergency notifications.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          <span className="relative flex items-center justify-center">
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Adding Contact...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus mr-2"></i>
                Add Emergency Contact
              </>
            )}
          </span>
        </button>
      </form>
    </>
  );
}

export default ContactForm;
