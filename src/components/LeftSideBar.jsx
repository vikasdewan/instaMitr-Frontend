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
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>IM</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  { icon: <LogOut />, text: "Logout" },
];

function LeftSideBar() {
  
  const navigate = useNavigate()
  const logoutHandler = async()=>{
    try {
      
      const res = await axios.get('http://localhost:8000/api/v1/user/logout',{withCredentials:true});
      if(res.data.status){
        navigate("/login");
        toast.success(res.data.message);
      } 

    } catch (error) {
      toast.error(error.response.data.message);
    }
  } 

  const sidebarHandler = (textType)=>{
    console.log(`sidebarHandler called with textType: ${textType}`);
     if(textType === 'Logout')  logoutHandler();
 
  }

  return (
    <div className="bg-black text-white fixed top-0 z-10 left-0 px-4 border-r-4 border-grey-300 w-[16%] h-screen">
      <div className="flex flex-col  mt-6">
        <h1
          className=" text-2xl m-3"
          style={{ fontFamily: "Pacifico, sans-serif" }}
        >
          InstaMitr
        </h1>
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
  );
}

export default LeftSideBar;
