import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import { useDispatch } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice";

function Profile() {
  const { isCollapsed } = useSidebar();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 🔍 Fetch user profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const dispatch = useDispatch();
      if (data.success) {
        setProfile({
          name: data.data.name,
          email: data.data.email,
          mobile: data.data.mobile,
        });
        dispatch(updateProfile(data.data));
        toast.success("✅ Profile updated successfully!");
      } else {
        toast.error("⚠️ Failed to fetch profile details.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("⚠️ Network error while loading profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✏️ Update user profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(data.data));
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("⚠️ Network error while updating profile.");
    } finally {
      setUpdating(false);
    }
  };

  // 🔑 Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPassword(true);

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.warning("⚠️ Please fill all password fields.");
      setChangingPassword(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.warning("⚠️ New passwords do not match.");
      setChangingPassword(false);
      return;
    }

    try {
      const res = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("🔐 Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Failed to change password.");
      }
    } catch (err) {
      console.error("Password change error:", err);
      toast.error("⚠️ Network error while changing password.");
    } finally {
      setChangingPassword(false);
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

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <i className="fas fa-user-circle mr-4 text-purple-400"></i>
                My Profile
              </h1>
              <p className="text-purple-200 text-sm">
                Manage your account settings and security preferences
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
              <i className="fas fa-shield-alt text-green-400"></i>
              <span className="text-white text-sm font-medium">Account Verified</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-6xl text-purple-400 mb-4"></i>
              <p className="text-white text-xl">Loading your profile...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Details Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <i className="fas fa-id-card mr-3 text-purple-400"></i>
                  Profile Details
                </h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-semibold">{profile.name || "User"}</h3>
                      <p className="text-purple-300 text-sm">{profile.email || "No email set"}</p>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-purple-100 block">
                      <i className="fas fa-user mr-2 text-purple-300"></i>
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-user-circle text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                      </div>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
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
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-at text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                      </div>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                      />
                    </div>
                  </div>

                  {/* Mobile Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-purple-100 block">
                      <i className="fas fa-phone mr-2 text-purple-300"></i>
                      Mobile Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-mobile-alt text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                      </div>
                      <input
                        type="tel"
                        value={profile.mobile}
                        onChange={(e) =>
                          setProfile({ ...profile, mobile: e.target.value })
                        }
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                      />
                    </div>
                  </div>

                  {/* Update Button */}
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <span className="relative flex items-center justify-center">
                      {updating ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Update Profile
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <i className="fas fa-lock mr-3 text-purple-400"></i>
                  Change Password
                </h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  {/* Security Info */}
                  <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl mb-6">
                    <i className="fas fa-info-circle text-blue-400 text-lg mt-0.5"></i>
                    <div>
                      <p className="text-sm text-blue-200 mb-1">
                        <strong>Password Requirements:</strong>
                      </p>
                      <ul className="text-xs text-blue-200 space-y-1 ml-4 list-disc">
                        <li>At least 8 characters long</li>
                        <li>Mix of uppercase and lowercase letters</li>
                        <li>Include numbers and special characters</li>
                      </ul>
                    </div>
                  </div>

                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-purple-100 block">
                      <i className="fas fa-key mr-2 text-purple-300"></i>
                      Current Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                      </div>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-purple-100 block">
                      <i className="fas fa-key mr-2 text-purple-300"></i>
                      New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                      </div>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-purple-100 block">
                      <i className="fas fa-check-circle mr-2 text-purple-300"></i>
                      Confirm New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                      </div>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                      />
                    </div>
                  </div>

                  {/* Change Password Button */}
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <span className="relative flex items-center justify-center">
                      {changingPassword ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-shield-alt mr-2"></i>
                          Change Password
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
