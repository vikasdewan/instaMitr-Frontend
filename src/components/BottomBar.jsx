import React from "react";
import { useEffect } from "react";
import { Heart, Home, LogOut, MessageCircle, PlaySquare, PlusSquare, Search, TrendingUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { useState } from "react";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { setlikeNotiList } from "@/redux/realTimeNotiSlice";

export function BottomBar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { likeNotiList } = useSelector((store) => store.realTimeNoti);
  const [showPopover,setShowPopover] = useState(true);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://instamitr-backend.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res?.data.status) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const sidebarHandler = (textType) => {
    console.log(`sidebarHandler called with textType: ${textType}`);
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType == "Messages") {
      navigate("/chat");
    } else if (textType == "Search") {
      navigate("/search");
    }
  };

  const sideBarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    // { icon: <TrendingUp />, text: "Explore" },
    // { icon: <PlaySquare />, text: "Reels" },
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

  useEffect(()=>{
    if(likeNotiList.length>0 && !showPopover  )
     dispatch(setlikeNotiList([]))
   },[showPopover,dispatch,likeNotiList])
 
   const handlePopoverClick = ()=>{
     setShowPopover(false)
     dispatch(setlikeNotiList([]))
   }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white border-t border-gray-700 flex justify-around items-center py-2 md:hidden">
      {sideBarItems.map((item, index) => (
        <div
          onClick={() => sidebarHandler(item.text)}
          key={index}
          className="flex flex-col items-center cursor-pointer"
        >
          {item.icon}
          <span className="text-xs">{item.text}</span>
          {
                item.text === 'Notifications' && likeNotiList?.length>0 && showPopover &&(
                  <Popover className="left-0">
                    <PopoverTrigger asChild>
                    <div>
                      <Button size='icon' className= ' bg-red-500 hover:bg-red-500 rounded-full h-5 w-5 absolute top-1 md:bottom-6  md:left-6'>{likeNotiList?.length}</Button>
                    </div>
                    </PopoverTrigger>
                    <PopoverContent onInteractOutside={handlePopoverClick} className='bg-black w-full h-48 overflow-auto'>
                      <div >
                        {
                          likeNotiList.length == 0 ? (<p>No new notification</p>) : (
                            likeNotiList.map((notification)=>{
                             return(
                                <div key={notification.userId} className=" bg-black mt-3 text-white flex gap-3 items-center justify-start">
                                    <Avatar>
                                      <AvatarImage src={notification?.userDetails?.profileImage}/>
                                      <AvatarFallback>IM</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm"><span className="font-bold">{notification?.userDetails?.username}</span> Liked your post </p>
                                </div>  
                              )
                            })
                          )
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                )
              }
        </div>
      ))}
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default BottomBar;
