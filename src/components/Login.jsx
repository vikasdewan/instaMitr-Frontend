import { Label } from "./ui/label.jsx";
import React from "react";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

function Login() {
  const [input, setInput] = useState({ email: "", password: "" });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const [loading, setloading] = useState(false);

  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
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

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-black text-white">
      <form
        onSubmit={signupHandler}
        className="shadow-white shadow-lg flex flex-col gap-1 p-7 w-96"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">InstaMitr</h1>
          <p className="pl-2 text-sm text-center font-bold mt-2">
            login to see photos and videos from your Friends
          </p>
        </div>
        <div>
          <Label className="font-medium pl-1">Email</Label>
          <Input
            type="email"
            placeholder="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="text-black focus-visible:ring-transparent my-2 bg-slate-200"
          />
        </div>
        <div>
          <Label className="font-medium pl-1">Password</Label>
          <Input
            type="password"
            placeholder="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="text-black focus-visible:ring-transparent my-2 bg-slate-200"
          />
        </div>

        <p className="text-xs text-center text-slate-400">
          People who use our service may have uploaded your contact information
          to Instagrams. <span className="text-blue-500">Learn More</span>
        </p>

        <p className="text-xs text-center text-slate-400">
          By signing up, you agree to our{" "}
          <span className="text-blue-500">Terms</span> ,{" "}
          <span className="text-blue-500">Privacy Policy</span> and{" "}
          <span className="text-blue-500">Cookie Policy</span>{" "}
        </p>

        <Button
          type="submit"
          className="bg-slate-300 text-black mt-5 hover:bg-white"
        >
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;