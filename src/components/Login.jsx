import { Label } from "./ui/label.jsx";
import React, { useEffect } from "react";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice.js";
import Loader from "./Loader.jsx";

function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const { user } = useSelector((state) => state.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const [loading, setloading] = useState(false);
  const [webLoading, setWebLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDemoBox, setShowDemoBox] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowDemoBox(false), 15000); // 30 seconds
    return () => clearTimeout(timer);
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
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
      console.log(error);
      toast.error(error.response.data.message);
      setInput({
        email: "",
        password: "",
      });
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Simulate a delay for loading content, like fetching data
    setTimeout(() => {
      setWebLoading(false);
    }, 2000); // Adjust the timeout as needed
  }, []);

  return (
    <>
      {webLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap-reverse items-center w-screen h-screen justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
          <div className="flex flex-wrap gap-4">
            <form
              onSubmit={loginHandler}
              className="shadow-lg flex flex-col gap-1 bg-black p-7 w-96 rounded-md"
            >
              <div className="my-4">
                <h1 className="text-center font-bold text-2xl text-pink-500">
                  InstaMitr
                </h1>
                <p className="pl-2 text-sm text-center font-medium mt-2 text-gray-300">
                  Login to see photos and videos from your friends.
                </p>
              </div>
              <div>
                <Label className="font-medium pl-1 text-gray-400">Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="text-black font-bold focus-visible:ring-transparent my-2 bg-gray-200"
                />
              </div>
              <div>
                <Label className="font-medium pl-1 text-gray-400">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  className="text-black font-bold focus-visible:ring-transparent my-2 bg-gray-200"
                />
              </div>

              <p className="text-xs text-center text-gray-500">
                People who use our service may have uploaded your contact
                information to Instagram.{" "}
                <span className="text-blue-500">Learn More</span>
              </p>

              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our{" "}
                <span className="text-blue-500">Terms</span>,{" "}
                <span className="text-blue-500">Privacy Policy</span> and{" "}
                <span className="text-blue-500">Cookie Policy</span>.
              </p>

              {loading ? (
                <Button className="bg-blue-500 text-white mt-5 hover:bg-blue-600">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-blue-500 text-white mt-5 hover:bg-blue-600"
                >
                  Login
                </Button>
              )}

              <span className="text-right font-bold text-sm mt-4">
                Don't have an account?{" "}
                <Link to="/signup" className="text-pink-500">
                  Sign up
                </Link>
              </span>
            </form>
          </div>
          {/* Demo Box */}
          {showDemoBox && (
            <div className="relative bg-gradient-to-br from-white to-gray-100 ml-4 text-black p-6 rounded-2xl shadow-2xl w-80 animate-fade-in border border-pink-200">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-pink-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
                <h2 className="text-lg font-extrabold text-pink-600">
                  Try InstaMitr Instantly!
                </h2>
              </div>

              <p className="text-sm leading-relaxed mb-4 text-gray-700">
                Want to explore the platform without creating an account? Use
                our demo login:
              </p>

              <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm shadow-inner">
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="ml-2 font-serif text-gray-800">
                    demo@gmail.com
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Password:</span>
                  <span className="ml-2 font-mono text-gray-800">1234</span>
                </div>
              </div>

              <p className="text-xs text-right mt-4 text-gray-400 italic">
                This message will disappear in 15 seconds.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Login;
