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
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-purple-900 to-indigo-800 p-4">
  <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
    
    {/* Left: Vector Illustration */}
    <div className="hidden md:flex items-center justify-center bg-white/5 p-6">
      <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/cloud-computing-service-4658252-3880447.png"  
        alt="Login Illustration"
        className="w-4/5 h-auto object-contain animate-float"
      />
    </div>

    {/* Right: Login Form */}
    <div className="p-8 md:p-12 flex flex-col justify-center">
      <h1 className="text-3xl font-extrabold text-pink-400 mb-4">InstaMitr</h1>
      <form onSubmit={loginHandler} className="space-y-4">
        <Input
          className="w-full px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 bg-white/90 placeholder-gray-600"
         placeholder="you@example.com"
          name="email"
          value={input.email}
          onChange={changeEventHandler}
        />
        <Input
          type="password"
          className="w-full px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 bg-white/90 placeholder-gray-600"
          placeholder="••••••••"
          name="password"
          value={input.password}
          onChange={changeEventHandler}
        />

        {/* 
        <div className="flex justify-between items-center text-sm text-gray-200">
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-pink-400" />
            <span className="ml-2">Remember me</span>
          </label>
          <Link to="/forgot-password" className="underline hover:text-pink-200">Forgot?</Link>
        </div>
        */}

        

          {loading ? (
                <Button className="w-full bg-pink-500 hover:bg-pink-600 py-3 font-bold">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 py-3 font-bold"
                >
                  Login
                </Button>
              )}
      </form>

      <p className="text-gray-300 text-center mt-6 font-bold text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-pink-400 hover:underline">Sign up</Link>
      </p>
    </div>
  </div>
</div>





      )}
    </>
  );
}

export default Login;
