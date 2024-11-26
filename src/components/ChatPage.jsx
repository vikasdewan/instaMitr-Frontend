import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const ChatPage = () => {
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const isOnline = false;

  return (
    <div className="ml-48  text-white flex">
      <section>
        <h1 className="font-bold mb-4 px-4 text-lg">{user?.username}</h1>
        <hr className="mb-4 border-gray-600 " />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            return (
              <div className=" ml-3 flex gap-3 items-center p-3 hover:bg-gray-900 cursor-pointer rounded-">
                <Avatar>
                  <AvatarImage
                    src={suggestedUser?.profileImage}
                    alt="profile_image"
                  />
                  <AvatarFallback>IM</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium">
                        {suggestedUser?.username}
                    </span>
                    <span className={`text-xs font-bold ${isOnline ? 'text-green-500' : 'text-red-600'}`}>{isOnline ? "online" : "offline"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
