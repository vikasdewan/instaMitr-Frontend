import React, { useEffect, useState } from "react";
import { Heart, Home, LogOut, MessageCircle, PlaySquare, PlusSquare, Search, TrendingUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { setlikeNotiList } from "@/redux/realTimeNotiSlice";


function LeftSideBar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { likeNotiList } = useSelector((store) => store.realTimeNoti);
  const [showPopover,setShowPopover] = useState(true);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
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

  useEffect(()=>{
   if(likeNotiList.length>0 && !showPopover  )
    dispatch(setlikeNotiList([]))
  },[showPopover,dispatch,likeNotiList])

  const handlePopoverClick = ()=>{
    setShowPopover(false)
    dispatch(setlikeNotiList([]))
  }

  return (
    <div className="bg-black text-white fixed top-0 left-0 px-4 border-r-2 border-r-gray-700 h-screen hidden md:flex">
      <div className="flex flex-col mt-6">
        <h1 className="text-2xl m-3" style={{ fontFamily: "Pacifico, sans-serif" }}>
          InstaMitr
        </h1>
        <div>
          {sideBarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="font-bold p-3 ml-1 flex mt-3 relative hover:bg-gray-900 cursor-pointer rounded-xl"
            >
              {item.icon}
              <span className="ml-4">{item.text}</span>
              {item.text === "Notifications" && likeNotiList?.length > 0 && showPopover && (
                <Popover    >
                  <PopoverTrigger asChild  >
                    <div>
                      <Button
                        size="icon"
                        className="bg-red-500 hover:bg-red-500 rounded-full h-5 w-5 absolute bottom-6 left-6"
                      >
                        {likeNotiList?.length}
                      </Button>
                    </div>
                  </PopoverTrigger >
                  <PopoverContent onInteractOutside={handlePopoverClick} className="bg-black w-full h-48 overflow-auto">
                    <div>
                      {likeNotiList.length == 0 ? (
                        <p>No new notification</p>
                      ) : (
                        likeNotiList.map((notification) => (
                          <div
                            key={notification.userId}
                            className="bg-black mt-3 text-white flex gap-3 items-center justify-start"
                          >
                            <Avatar>
                              <AvatarImage src={notification?.userDetails?.profileImage} />
                              <AvatarFallback>IM</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="font-bold">{notification?.userDetails?.username}</span> Liked your post
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default LeftSideBar;
