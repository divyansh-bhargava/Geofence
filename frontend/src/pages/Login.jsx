import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);

    if (!form.login || !form.password) {
      toast.warning("⚠️ Please enter your email/mobile and password.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      toast.warning("⚠️ Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: form.login,
          password: form.password,
        }),
      });

      const data = await res.json();

      const dispatch = useDispatch();

      if (data.success) {
        dispatch(loginSuccess(data.data)); // store user & token globally
        toast.success("✅ Login successful!");
        navigate("/dashboard");

      } else {
        toast.error(data.message || "Invalid credentials. Please try again.", {
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("⚠️ Network error. Please try again later.", {
        position: "top-right",
      });
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
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-purple-500/20 transition-all duration-300">
          
          {/* Header Section */}
          <div className="p-8 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 mb-5 shadow-lg shadow-purple-500/50 relative animate-bounce">
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
              <i className="fas fa-map-marked-alt text-white text-4xl relative z-10"></i>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              IoT Geo-Fencing
            </h1>
            <p className="text-purple-200 text-sm font-medium">
              🔒 Advanced Security & Real-time Monitoring
            </p>
          </div>

          {/* Login Form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email or Mobile Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-purple-100 block flex items-center">
                  <i className="fas fa-user-circle mr-2 text-purple-300"></i>
                  Email or Mobile Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter email or mobile number"
                    value={form.login}
                    onChange={(e) => setForm({ ...form, login: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400/50 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-purple-100 block flex items-center">
                  <i className="fas fa-shield-alt mr-2 text-purple-300"></i>
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-purple-400 group-focus-within:text-purple-300 transition-colors"></i>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your secure password"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-purple-200 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500 mr-2"
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="text-purple-300 hover:text-white transition-colors font-medium">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Sign In Securely
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-purple-300">Or continue with</span>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 bg-white/5 border-2 border-white/20 rounded-xl text-white hover:bg-white/15 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 group"
                >
                  <i className="fab fa-google mr-2 text-lg group-hover:scale-110 transition-transform"></i>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 bg-white/5 border-2 border-white/20 rounded-xl text-white hover:bg-white/15 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 group"
                >
                  <i className="fab fa-microsoft mr-2 text-lg group-hover:scale-110 transition-transform"></i>
                  Microsoft
                </button>
              </div>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-purple-200 text-sm">
                Don't have an account?{" "}
                <a href="/register" className="text-white font-semibold hover:underline">
                  Create Account
                </a>
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

export default Login;
