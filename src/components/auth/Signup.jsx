import React, { useEffect, useState } from "react";
import { Input, Button } from "../ui/index.js";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, X } from "lucide-react";
import { useSelector } from "react-redux";
import InstaImage from "../../assets/image.png";
import { APP_BASE_URL } from "@/config.js";

function Signup() {
  const [input, setInput] = useState({ username: "", password: "", email: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [userId, setUserId] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const res = await axios.post(
      `${APP_BASE_URL}/api/v1/user/register`,
      input,
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      setUserId(res.data.userId);
      setShowOtpDialog(true);
    }
  } catch (error) {
    const msg = error.response?.data?.message || "Signup failed";
    toast.error(msg);

    // Only clear form if it's truly invalid (not just unverified user)
    if (!msg.includes("not verified")) {
      setInput({ username: "", password: "", email: "" });
    }
  } finally {
    setLoading(false);
  }
};


  const verifyOtpHandler = async () => {
    if (!otp) return toast.error("Please enter OTP");

    try {
      setOtpLoading(true);
      const res = await axios.post(
        `${APP_BASE_URL}/api/v1/user/verify-otp`,
        { userId, otp },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setShowOtpDialog(false);
        navigate("/login");
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOtpHandler = async () => {
    try {
      setResendLoading(true);
      const res = await axios.post(
        `${APP_BASE_URL}/api/v1/user/resend-otp`,
        { userId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setResendCooldown(30);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 font-inter">
      <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl w-full gap-12">
        {/* Left - Illustration */}
        <div className="hidden md:block relative w-[720px] h-[620px] drop-shadow-xl">
          <img
            src={InstaImage}
            alt="Instagram preview"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        {/* Right - Signup Form */}
        <div className="w-full max-w-sm bg-[#111111] border border-zinc-800 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] p-10 backdrop-blur-sm">
          <h1 className="text-white text-4xl font-logo text-center mb-6 tracking-wide">
            I<span className="font-serif">nsta</span>M
            <span className="font-serif">itr</span>
          </h1>
          <h2 className="text-pink-300 text-lg text-center font-medium mb-6">
            Create your account
          </h2>

          <form onSubmit={signupHandler} className="space-y-4">
            <Input
              name="username"
              placeholder="Username"
              value={input.username}
              onChange={changeEventHandler}
              className="w-full bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={input.email}
              onChange={changeEventHandler}
              className="w-full bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            {/* Password with toggle */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={input.password}
                onChange={changeEventHandler}
                className="w-full pr-12 bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-3 transform -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 transition-all duration-200"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline font-medium">
              Log in
            </Link>
          </p>

          <a
            href={`${APP_BASE_URL}/api/v1/user/google`}
            className="w-full mt-4 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-3 text-center transition-all duration-200"
          >
            Continue with Google
          </a>
        </div>
      </div>

      {/* OTP Dialog */}
      {showOtpDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f1f1f] border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-xl relative space-y-4">
            <button
              onClick={() => setShowOtpDialog(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-semibold text-white text-center mb-2">
              Verify Your Account
            </h3>
            <p className="text-center text-zinc-400 text-sm mb-4">
              Enter the OTP sent to your email
            </p>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={verifyOtpHandler}
              disabled={otpLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg py-3"
            >
              {otpLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Verify OTP"}
            </Button>

            {/* Resend OTP Button */}
            <Button
              onClick={resendOtpHandler}
              disabled={resendCooldown > 0 || resendLoading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 flex justify-center items-center"
            >
              {resendLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : resendCooldown > 0 ? (
                `Resend OTP in ${resendCooldown}s`
              ) : (
                "Resend OTP"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
