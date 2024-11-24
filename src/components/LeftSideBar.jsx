import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlaySquare,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { useState } from "react";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

function LeftSideBar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open , setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res?.data.status) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null))
        dispatch(setPosts([]))
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

 
  const sidebarHandler = (textType) => {
    console.log(`sidebarHandler called with textType: ${textType}`);
    if (textType === "Logout") 
      {
      logoutHandler();
    }else if(textType === "Create"){
 setOpen(true);
    } else if(textType === "Profile"){
      navigate(`/profile/${user?._id}`);
    }
  };

  const sideBarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <PlaySquare />, text: "Reels" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profileImage} alt="@shadcn" />
          <AvatarFallback>IM</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="bg-black text-white fixed top-0   left-0 px-4 border-r-2 border-r-gray-700 w-[16%] h-screen">
      <div className="flex flex-col  mt-6">
        <h1
          className=" text-2xl m-3"
          style={{ fontFamily: "Pacifico, sans-serif" } }
        >
          InstaMitr
        </h1>
        <div>
        {sideBarItems.map((item, index) => {
          return (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className=" font-bold  p-3 ml-1 flex mt-3 relative hover:bg-gray-900 cursor-pointer rounded-xl  "
            >
              {item.icon}
              <span className="ml-4 ">{item.text}</span>
            </div>
          );
        })}
        </div>
      </div>

      <CreatePost open={open}  setOpen={setOpen} />
    </div>

  );
}

export default LeftSideBar;
