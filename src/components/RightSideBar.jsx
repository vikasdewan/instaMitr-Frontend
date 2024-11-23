import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

function RightSideBar() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="text-white bg-black w-fit py-10 pr-32 text-sm ">
      <div className="flex item-center gap-2 ">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="text-black">
            <AvatarImage src={user?.profileImage} alt="post_image" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
        </Link>
        <Link to={`/profile/${user?._id}`}>
          <div>
            <h1 className="font-bold text-sm">{user?.username}</h1>
            <span className="text-gray-400 text-sm ">
              {user?.bio || "Bio Here...."}
            </span>
          </div>
        </Link>
      </div>
      <SuggestedUsers/>
    </div>
  );
}

export default RightSideBar;
