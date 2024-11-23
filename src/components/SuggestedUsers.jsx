import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="mt-5">
      <div className="flex justify-between ">
        <h1 className="font-semibold text-gray-400 text-sm">
          Suggested for you
        </h1>
        <span className="font-semibold text-xs mt-0.5 cursor-pointer text-gray-300 ">
          See All
        </span>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div key={user.id} className="flex items-center mt-2">
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
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUsers;
