import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/index.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
 
import { useNavigate } from "react-router-dom";

function SuggestedUsersPage() {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

   

  return (
    <div className="flex px-2 flex-col items-start justify-start min-h-screen bg-black text-white md:hidden">
      <div className="flex items-center gap-2 mb-4 pt-6 pl-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="text-black">
            <AvatarImage src={user?.profileImage} alt="profile_image" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-bold text-sm">{user?.username}</h1>
          <span className="text-gray-400 text-sm">{user?.bio || "Bio Here...."}</span>
        </div>
      </div>
      <SuggestedUsers />
       
    </div>
  );
}

export default SuggestedUsersPage;
