import React, { useEffect, useState } from "react";
import { Input, Button } from "../ui/index.js";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import InstaImage from "../../assets/image.png";
import { APP_BASE_URL } from "@/config.js";

function Signup() {
  const [input, setInput] = useState({ username: "", password: "", email: "" });
  const [showPassword, setShowPassword] = useState(false); // 👈 added
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
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
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      setInput({ username: "", password: "", email: "" });
    } finally {
      setLoading(false);
    }
  };

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
            I<span className="font-serif">nsta</span>M<span className="font-serif">itr</span>
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
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
