import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1 = Request OTP, Step 2 = Reset Password
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 📨 Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.warning("⚠️ Please enter your registered email.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        toast.info("📩 OTP sent to your email.");
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send reset OTP.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("⚠️ Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Step 2: Verify OTP + Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.otp || !form.newPassword || !form.confirmPassword) {
      toast.warning("⚠️ Please fill all fields.");
      setLoading(false);
      return;
    }

    if (form.newPassword.length < 6) {
      toast.warning("⚠️ Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.warning("⚠️ Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: form.otp,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Invalid OTP or failed to reset.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("⚠️ Network error during reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Background Decorative Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        {/* Forgot Password Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-purple-500/20 transition-all duration-300">
          
          {/* Header Section */}
          <div className="p-8 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 mb-5 shadow-lg shadow-purple-500/50 relative animate-bounce">
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
              <i className={`fas ${step === 1 ? 'fa-key' : 'fa-lock-open'} text-white text-4xl relative z-10`}></i>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              {step === 1 ? "Reset Password" : "Create New Password"}
            </h1>
            <p className="text-purple-200 text-sm font-medium">
              {step === 1 
                ? "🔐 Enter your email to receive reset code" 
                : "✨ Enter OTP and set your new password"}
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-8">
            {step === 1 ? (
              // 🔹 Step 1: Request OTP Form
              <form onSubmit={handleRequestOTP} className="space-y-5">
                
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block flex items-center">
                    <i className="fas fa-envelope mr-2 text-purple-300"></i>
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-at text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                    />
                  </div>
                </div>

                {/* Send OTP Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Send Reset OTP
                    </>
                  )}
                </button>

                {/* Info Message */}
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 text-sm text-blue-200">
                  <i className="fas fa-info-circle mr-2"></i>
                  We'll send a 6-digit verification code to your email
                </div>
              </form>
            ) : (
              // 🔹 Step 2: Reset Password Form
              <form onSubmit={handleResetPassword} className="space-y-5">
                
                {/* OTP Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block flex items-center">
                    <i className="fas fa-shield-alt mr-2 text-purple-300"></i>
                    Verification Code
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-hashtag text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={form.otp}
                      onChange={(e) => setForm({ ...form, otp: e.target.value })}
                      required
                      maxLength="6"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10 text-center text-2xl tracking-widest"
                    />
                  </div>
                </div>

                {/* New Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block flex items-center">
                    <i className="fas fa-lock mr-2 text-purple-300"></i>
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-key text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300 hover:text-white transition-colors"
                    >
                      <i className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block flex items-center">
                    <i className="fas fa-check-circle mr-2 text-purple-300"></i>
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-check-double text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300 hover:text-white transition-colors"
                    >
                      <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle mr-2"></i>
                      Reset Password
                    </>
                  )}
                </button>

                {/* Resend OTP */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-purple-300 hover:text-white transition-colors"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Didn't receive code? Resend OTP
                </button>
              </form>
            )}

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <p className="text-purple-200 text-sm">
                Remember your password?{" "}
                <Link to="/login" className="text-white font-semibold hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center text-purple-200 text-xs bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <i className="fas fa-shield-alt mr-2 text-green-400"></i>
              <span className="font-medium">🔐 Secured with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-purple-300 text-xs">
          <p>&copy; 2025 IoT Geo-Fencing Security System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
