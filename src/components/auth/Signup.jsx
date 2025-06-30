
import React, { useEffect } from "react";
import {
  Input ,
  Button 
} from "../ui/index.js";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { APP_BASE_URL } from "@/config.js";

function Signup() {
  const [input, setInput] = useState({ username: "", password: "", email: "" });
  const { user } = useSelector((store) => store.auth);
  
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setInput({
        username: "",
        password: "",
        email: "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-purple-900 to-indigo-800 p-4">
  <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl grid grid-cols-1 md:grid-cols-2">
    
    {/* 🌟 Left Side: Vector or Illustrative Image */}
    <div className="hidden md:flex items-center justify-center bg-white/5 p-6">
      <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/cloud-computing-service-4658252-3880447.png"
        alt="Signup Illustration"
        className="w-4/5 h-auto object-contain animate-float"
      />
    </div>

    {/* 📝 Right Side: Signup Form */}
    <div className="p-8 md:p-12 flex flex-col justify-center">
       <h1 className="text-4xl font-extrabold text-center text-pink-400 mb-4">InstaMitr</h1>
      <h1 className="text-2xl font-extrabold text-center  text-pink-300 mb-6">Create your free account</h1>
      <form onSubmit={signupHandler} className="space-y-5">

        <Input
          type="text"
          name="username"
          placeholder="xyz"
          value={input.username}
          onChange={changeEventHandler}
          className="w-full px-4 py-3 bg-white/90 placeholder-gray-600 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <Input
          type="email"
          name="email"
          placeholder="you@gmail.com"
          value={input.email}
          onChange={changeEventHandler}
          className="w-full px-4 py-3 bg-white/90 placeholder-gray-600 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          value={input.password}
          onChange={changeEventHandler}
          className="w-full px-4 py-3 bg-white/90 placeholder-gray-600 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <Button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 py-3 font-bold transition"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
        </Button>
      </form>

      <p className="text-gray-300 text-center font-bold text-sm mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-pink-400 hover:underline">Login</Link>
      </p>
    </div>
  </div>
</div>

  );
}

export default Signup;
