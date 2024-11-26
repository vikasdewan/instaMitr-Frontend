import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRealTimeMsg from "@/hooks/useGetRealTimeMsg";

export const Messages = () => {
  useGetRealTimeMsg();
  useGetAllMessage();
    const {user} = useSelector(store=> store.auth);
    const {messages} = useSelector(store => store.chat)
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
             messages && messages?.map((msg)=>{
                 return (
                    <div key={msg?._id} className={` flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'} `}>
                        <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500' : 'bg-gray-600'}`}>
                            {msg.message}
                        </div>
                    </div>
                 )
            })
            }
        </div>
    </div>
  );
};
