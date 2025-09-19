import { useState } from "react";
import { api, setToken } from "../api";
import { Eye, EyeOff } from "lucide-react";
import { authStore } from "../auth";
// const [showPassword, setShowPassword] = useState(false);


export default function AuthPage({ defaultTab = "login" }) {
  const [tab, setTab] = useState(defaultTab); // "login" | "signup" | "forgot"
  const [signupStep, setSignupStep] = useState("form");
  const [forgotStep, setForgotStep] = useState("form");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);


  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        auth: false,
        body: { email, password },
      });
      setToken(res.token);
      authStore.setUser(res.user);
      window.location.href = res.redirect;
    } catch (err) {
      setMsg(err.message || "Login failed");
    }
  };

  /* ---------------- SIGNUP STEP 1 (Request OTP) ---------------- */
  const handleSignupRequestOtp = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api("/api/auth/signup/request-otp", {
        method: "POST",
        auth: false,
        body: { name, email, password },
      });
      setSignupStep("otp");
      setMsg("✅ OTP sent to your email");
    } catch (err) {
      setMsg(err.message || "Signup failed");
    }
  };

  /* ---------------- SIGNUP STEP 2 (Verify OTP) ---------------- */
  const handleSignupVerifyOtp = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api("/api/auth/signup/verify-otp", {
        method: "POST",
        auth: false,
        body: { email, otp },
      });
      setMsg("🎉 Signup successful! Please login.");
      setTab("login");
      setSignupStep("form");
    } catch (err) {
      setMsg(err.message || "OTP verification failed");
    }
  };

  /* ---------------- FORGOT STEP 1 (Request OTP) ---------------- */
  const handleForgotRequestOtp = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api("/api/auth/forgot/request-otp", {
        method: "POST",
        auth: false,
        body: { email },
      });
      setForgotStep("otp");
      setMsg("✅ OTP sent to your email");
    } catch (err) {
      setMsg(err.message || "Failed to send OTP");
    }
  };

  /* ---------------- FORGOT STEP 2 (Reset Password) ---------------- */
  const handleForgotReset = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api("/api/auth/forgot/reset", {
        method: "POST",
        auth: false,
        body: { email, otp, newPassword },
      });
      setMsg("🎉 Password reset successful! Please login.");
      setTab("login");
      setForgotStep("form");
    } catch (err) {
      setMsg(err.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-800 px-3 sm:px-4">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Auth Card */}
        <div className="p-6 sm:p-10 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {tab === "login" && "Welcome back 👋"}
            {tab === "signup" && "Create your account 🚀"}
            {tab === "forgot" && "Reset your password 🔑"}
          </h1>
          <p className="text-gray-200 mb-4 sm:mb-6 text-sm sm:text-base">
            {tab === "login" && "Please login with your details to continue"}
            {tab === "signup" && "Sign up with your email and get started"}
            {tab === "forgot" && "Enter your email to reset your password"}
          </p>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-3 mb-6">
            <button
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold ${
                tab === "login"
                  ? "bg-white text-indigo-700"
                  : "bg-white/20 text-white"
              }`}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold ${
                tab === "signup"
                  ? "bg-white text-indigo-700"
                  : "bg-white/20 text-white"
              }`}
              onClick={() => setTab("signup")}
            >
              Signup
            </button>
            <button
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold ${
                tab === "forgot"
                  ? "bg-white text-indigo-700"
                  : "bg-white/20 text-white"
              }`}
              onClick={() => setTab("forgot")}
            >
              Forgot
            </button>
          </div>

          {/* LOGIN */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input bg-white/20 text-white placeholder-gray-300"
              />
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input bg-white/20 text-white placeholder-gray-300 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>


              <div className="flex justify-between items-center text-xs sm:text-sm text-gray-200">
                <label>
                  <input type="checkbox" className="mr-1" /> Keep me logged in
                </label>
                <button
                  type="button"
                  onClick={() => setTab("forgot")}
                  className="hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-lg hover:opacity-90 transition">
                Sign in
              </button>
            </form>
          )}

          {/* SIGNUP */}
          {tab === "signup" && signupStep === "form" && (
            <form onSubmit={handleSignupRequestOtp} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input bg-white/20 text-white placeholder-gray-300"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input bg-white/20 text-white placeholder-gray-300"
              />
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input bg-white/20 text-white placeholder-gray-300 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>



              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-lg hover:opacity-90 transition">
                Request OTP
              </button>
            </form>
          )}

          {tab === "signup" && signupStep === "otp" && (
            <form onSubmit={handleSignupVerifyOtp} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="input bg-white/20 text-white placeholder-gray-300"
              />
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-lg hover:opacity-90 transition">
                Verify & Signup
              </button>
            </form>
          )}

          {/* FORGOT */}
          {tab === "forgot" && forgotStep === "form" && (
            <form onSubmit={handleForgotRequestOtp} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input bg-white/20 text-white placeholder-gray-300"
              />
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-lg hover:opacity-90 transition">
                Request OTP
              </button>
            </form>
          )}

          {tab === "forgot" && forgotStep === "otp" && (
            <form onSubmit={handleForgotReset} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="input bg-white/20 text-white placeholder-gray-300"
              />
              <div className="relative">
                <input
                  type={showForgotPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="input bg-white/20 text-white placeholder-gray-300 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                >
                  {showForgotPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>


              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-lg hover:opacity-90 transition">
                Reset Password
              </button>
            </form>
          )}

          {msg && <p className="text-center text-sm text-yellow-200">{msg}</p>}
        </div>

        {/* Right Side Info */}
        <div className="hidden md:flex flex-col justify-center bg-black/30 text-white p-8 sm:p-12">
          <h2 className="text-2xl font-bold mb-4">About Placement App</h2>
          <p className="text-gray-200 mb-6 leading-relaxed">
            This platform helps students track{" "}
            <span className="font-semibold">
              placements, interviews, and company rounds
            </span>
            . Organize your progress, compare with peers, and prepare smarter.
            Trusted by students from top institutes 🚀
          </p>
          <div className="space-x-2">
            <span className="inline-block bg-pink-500 px-3 py-1 rounded-full text-sm">
              Track companies
            </span>
            <span className="inline-block bg-purple-500 px-3 py-1 rounded-full text-sm">
              Prepare smart
            </span>
            <span className="inline-block bg-indigo-500 px-3 py-1 rounded-full text-sm">
              Get placed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
