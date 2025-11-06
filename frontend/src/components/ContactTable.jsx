import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContactTable() {
  const token = localStorage.getItem("token");
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(false);

  // Fetch all contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contacts?page=1&limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
      } else {
        toast.error("⚠️ Failed to load contacts.");
      }
    } catch (err) {
      console.error("Fetch contacts error:", err);
      toast.error("⚠️ Network error while fetching contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Start editing contact
  const startEdit = (contact) => {
    setEditingId(contact._id);
    setEditForm({
      name: contact.name,
      email: contact.email,
      mobile: contact.mobile,
    });
  };

  // Save edited contact
  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Contact updated successfully!");
        setEditingId(null);
        fetchContacts();
      } else {
        toast.error(data.message || "Failed to update contact.");
      }
    } catch (err) {
      console.error("Update contact error:", err);
      toast.error("⚠️ Network error while updating contact.");
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("🗑️ Contact deleted successfully!");
        fetchContacts();
      } else {
        toast.error(data.message || "Failed to delete contact.");
      }
    } catch (err) {
      console.error("Delete contact error:", err);
      toast.error("⚠️ Network error while deleting contact.");
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
            <p className="text-white text-lg">Loading contacts...</p>
          </div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-address-book text-6xl text-purple-300/30 mb-4"></i>
          <p className="text-white text-xl mb-2">No contacts found</p>
          <p className="text-purple-300 text-sm">Add your first emergency contact above</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="space-y-4">
            {contacts.map((contact) =>
              editingId === contact._id ? (
                // Edit Mode
                <div
                  key={contact._id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-400/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-purple-200 block mb-2">
                        <i className="fas fa-user mr-1"></i> Name
                      </label>
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-purple-200 block mb-2">
                        <i className="fas fa-envelope mr-1"></i> Email
                      </label>
                      <input
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-purple-200 block mb-2">
                        <i className="fas fa-phone mr-1"></i> Mobile
                      </label>
                      <input
                        value={editForm.mobile}
                        onChange={(e) =>
                          setEditForm({ ...editForm, mobile: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(contact._id)}
                      className="flex-1 px-4 py-2 bg-green-500/20 border border-green-400/30 text-green-300 rounded-lg hover:bg-green-500/30 transition-all duration-200 font-semibold"
                    >
                      <i className="fas fa-check mr-2"></i>
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 px-4 py-2 bg-gray-500/20 border border-gray-400/30 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-all duration-200 font-semibold"
                    >
                      <i className="fas fa-times mr-2"></i>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div
                  key={contact._id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${contact.isActive ? "bg-green-500/20" : "bg-gray-500/20"}`}>
                        <i className={`fas fa-user ${contact.isActive ? "text-green-400" : "text-gray-400"} text-xl`}></i>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white text-lg font-semibold">{contact.name}</h4>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${contact.isActive ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-gray-500/20 text-gray-300 border border-gray-500/30"}`}>
                            {contact.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-purple-200">
                            <i className="fas fa-envelope w-4"></i>
                            <span>{contact.email || <span className="text-purple-400">No email</span>}</span>
                          </div>
                          <div className="flex items-center gap-2 text-purple-200">
                            <i className="fas fa-phone w-4"></i>
                            <span>{contact.mobile || <span className="text-purple-400">No mobile</span>}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(contact)}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-200 font-medium"
                      >
                        <i className="fas fa-edit mr-2"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-200 font-medium"
                      >
                        <i className="fas fa-trash mr-2"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ContactTable;
