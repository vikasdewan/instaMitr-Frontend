import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const Messages = () => {
    
    const {selectedUser} = useSelector((store) => store.chat);
  return (
    <div className="overflow-y-auto flex-1 p-4 ">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className = "w-28 h-28">
            <AvatarImage src={selectedUser?.profileImage} alt="profile_Image" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
          <span className="font-bold text-2xl">{selectedUser?.username}</span>
          <span className="text-gray-500 text-xs">{selectedUser?.username} . Instagram</span>
           <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 p-3 bg-gray-800 my-2">View Profile</Button></Link>
        </div>
      </div>
        <div className="flex flex-col gap-3">
            {
            [1,2,3,4].map((msg)=>{
                 return (
                    <div className={`flex`}>
                        <div>
                            {msg}
                        </div>
                    </div>
                 )
            })
            }
        </div>
    </div>
  );
};
