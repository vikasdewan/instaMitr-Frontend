import React, { useEffect, useState } from "react";
import { Input, Button } from "../ui/index.js";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/index.js";
import { Loader } from "../common/index.js";
import InstaImage from "../../assets/image.png";
import { APP_BASE_URL } from "@/config.js";

function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setloading] = useState(false);
  const [webLoading, setWebLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // 👈 added
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
      const res = await axios.post(
        `${APP_BASE_URL}/api/v1/user/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

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
            I<span className="font-serif">nsta</span>M<span className="font-serif">itr</span>
          </h1>

          <form onSubmit={loginHandler} className="space-y-4">
            <Input
              name="email"
              placeholder="Phone number, username, or email"
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
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

          <div className="text-center text-sm text-zinc-400 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
