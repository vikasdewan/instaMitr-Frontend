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
  { icon: <LogOut />, text: "logout" },
];

function LeftSideBar() {
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
