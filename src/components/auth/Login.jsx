import React, { useEffect, useState } from "react";
import { Input, Button } from "../ui/index.js";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/index.js";
import { Loader } from "../common/index.js";
import InstaImage from "../../assets/image.png";
import { APP_BASE_URL } from "@/config.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setloading] = useState(false);
  const [webLoading, setWebLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [openDialog, setOpenDialog] = useState(false); // 🔹 for Forgot Password dialog
  const [resetEmail, setResetEmail] = useState("");
  const [sending, setSending] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const res = await axios.post(`${APP_BASE_URL}/api/v1/user/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setInput({ email: "", password: "" });
    } finally {
      setloading(false);
    }
  };

  //  Forgot Password handler
  const sendResetPasswordLink = async (e) => {
  e.preventDefault();
  if (!resetEmail) {
    toast.error("Please enter your email");
    return;
  }

  try {
    setSending(true);
    console.log("📩 Forgot Password request starting...");
    console.log("👉 API URL:", `${APP_BASE_URL}/api/v1/user/forgot-password`);
    console.log("👉 Email entered:", resetEmail);

    const res = await axios.post(
      `${APP_BASE_URL}/api/v1/user/forgot-password`,
      { email: resetEmail },
      { withCredentials: true }
    );

    console.log("✅ Forgot Password response:", res);

    if (res.data.success) {
      toast.success(res.data.message);
      setOpenDialog(false);
      setResetEmail("");
    } else {
      console.warn("⚠️ Forgot Password API returned error:", res.data);
      toast.error(res.data.message || "Failed to send reset link");
    }
  } catch (error) {
    console.error("❌ Forgot Password request failed:", error);
    console.error("❌ Error details:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setSending(false);
    console.log("🔚 Forgot Password request finished");
  }
};

  //google login
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${APP_BASE_URL}/api/v1/user/me`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/"); // redirect to home
        toast.success("Logged in successfully");
      }
    } catch (error) {
      console.log("Not logged in yet");
    }
  };

  fetchUser();
}, [dispatch, navigate]);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    setTimeout(() => setWebLoading(false), 1000);
  }, []);

  return webLoading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl w-full gap-12">
        {/* Left - larger image */}
        <div className="hidden md:block relative w-[720px] h-[620px] drop-shadow-xl">
          <img
            src={InstaImage}
            alt="Instagram preview"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        {/* Right - login form */}
        <div className="w-full max-w-sm bg-[#111111] border border-zinc-800 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] p-10 backdrop-blur-sm">
          <h1 className="text-white text-4xl font-logo text-center mb-6 tracking-wide">
            I<span className="font-serif">nsta</span>M
            <span className="font-serif">itr</span>
          </h1>

          <form onSubmit={loginHandler} className="space-y-4">
            <Input
              name="email"
              placeholder="Email"
              className="font-inter w-full bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={input.email}
              onChange={changeEventHandler}
            />

            {/* Password input with toggle icon */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="font-inter w-full pr-12 bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={input.password}
                onChange={changeEventHandler}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-3 transform -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Please wait
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          {/* 🔹 Forgot Password Button */}
          <div className="text-center mt-4">
            <button
              onClick={() => setOpenDialog(true)}
              className="text-blue-400 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>

          <div className="text-center text-sm text-zinc-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:underline font-medium"
            >
              Sign up
            </Link>
            <a
              href={`${APP_BASE_URL}/api/v1/user/google`}
              className="w-full mt-4 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-3 text-center transition-all duration-200"
            >
              Continue with Google
            </a>
          </div>
        </div>
      </div>

      {/* 🔹 Forgot Password Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md bg-gray-800 text-white rounded-xl">
          <div className="flex justify-end">
            <button onClick={() => setOpenDialog(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              Reset Your Password
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={sendResetPasswordLink} className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="Enter your registered email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 rounded-lg"
              required
            />

            <div className="flex justify-end">
              {sending ? (
                <Button className="bg-green-600 hover:bg-green-700">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Send Reset Link
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Login;
