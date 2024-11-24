import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";

export const EditProfile = () => {
    const {user} = useSelector((store) =>store.auth)
  return (
    <div className="text-white   flex max-w-2xl mx-auto pl-10">
      <section>
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex item-center gap-2 ">
          
            <Avatar className="text-black">
              <AvatarImage src={user?.profileImage} alt="post_image" />
              <AvatarFallback>IM</AvatarFallback> 
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-400 text-sm ">
                {user?.bio || "Bio Here...."}
              </span>
            </div>
        </div>
      </section>
    </div>
  );
};
