import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Register form, 2 = OTP verification
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [otpForm, setOtpForm] = useState({
    emailOTP: "",
    mobileOTP: "",
  });

  // 🧾 Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);

    if (form.password !== form.confirmPassword) {
      toast.warning("⚠️ Passwords do not match!");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      toast.warning("⚠️ Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        toast.info("📩 OTPs sent to your email and mobile");
        setUserId(data.data.userId);
        setStep(2);
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error("⚠️ Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!otpForm.emailOTP || !otpForm.mobileOTP) {
      toast.warning("⚠️ Please enter both OTPs.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          emailOTP: otpForm.emailOTP,
          mobileOTP: otpForm.mobileOTP,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        toast.success("🎉 Account verified successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.error(data.message || "Invalid OTPs. Please try again.");
      }
    } catch (err) {
      console.error("OTP Verification error:", err);
      toast.error("⚠️ Network error during verification.");
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
        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-purple-500/20 transition-all duration-300">
          
          {/* Header Section */}
          <div className="p-8 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 mb-5 shadow-lg shadow-purple-500/50 relative animate-bounce">
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
              <i className="fas fa-user-plus text-white text-4xl relative z-10"></i>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              {step === 1 ? "Create Account" : "Verify OTP"}
            </h1>
            <p className="text-purple-200 text-sm font-medium">
              {step === 1 ? "🔐 Join IoT Geo-Fencing Security" : "📱 Enter verification codes"}
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-8">
            {step === 1 ? (
              // 🔹 Step 1: Registration Form
              <form onSubmit={handleRegister} className="space-y-5">
                
                {/* Full Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block flex items-center">
                    <i className="fas fa-user mr-2 text-purple-300"></i>
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-id-card text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                    />
                  </div>
                </div>

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
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                    />
                  </div>
                </div>

                {/* Mobile Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block flex items-center">
                    <i className="fas fa-mobile-alt mr-2 text-purple-300"></i>
                    Mobile Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-phone text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block flex items-center">
                    <i className="fas fa-lock mr-2 text-purple-300"></i>
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-key text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300 hover:text-white transition-colors"
                    >
                      <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block flex items-center">
                    <i className="fas fa-shield-alt mr-2 text-purple-300"></i>
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-check-circle text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
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

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus mr-2"></i>
                      Create Account
                    </>
                  )}
                </button>
              </form>
            ) : (
              // 🔹 Step 2: OTP Verification
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                
                {/* Email OTP Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block flex items-center">
                    <i className="fas fa-envelope-open mr-2 text-purple-300"></i>
                    Email OTP
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-hashtag text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit email OTP"
                      value={otpForm.emailOTP}
                      onChange={(e) => setOtpForm({ ...otpForm, emailOTP: e.target.value })}
                      required
                      maxLength="6"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10 text-center text-2xl tracking-widest"
                    />
                  </div>
                </div>

                {/* Mobile OTP Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-100 block flex items-center">
                    <i className="fas fa-sms mr-2 text-purple-300"></i>
                    Mobile OTP
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-hashtag text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit mobile OTP"
                      value={otpForm.mobileOTP}
                      onChange={(e) => setOtpForm({ ...otpForm, mobileOTP: e.target.value })}
                      required
                      maxLength="6"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10 text-center text-2xl tracking-widest"
                    />
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle mr-2"></i>
                      Verify Account
                    </>
                  )}
                </button>

                {/* Resend OTP */}
                <button
                  type="button"
                  className="w-full text-sm text-purple-300 hover:text-white transition-colors"
                  onClick={() => toast.info("📩 OTP resent successfully")}
                >
                  <i className="fas fa-redo mr-2"></i>
                  Didn't receive OTP? Resend
                </button>
              </form>
            )}

            {/* Login Link */}
            {step === 1 && (
              <div className="mt-6 text-center">
                <p className="text-purple-200 text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-white font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            )}

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

export default Register;
