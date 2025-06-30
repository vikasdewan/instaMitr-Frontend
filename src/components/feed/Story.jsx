import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/index.js";

function Story({ user }) {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-1 min-w-[70px]">
      <Link to={`/profile/${user?._id}`}>
        <div className="h-16 w-16 md:h-16 md:w-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
          <div className="h-full w-full rounded-full bg-white p-[2px]">
            <Avatar className="h-full w-full">
              <AvatarImage
                src={user?.profileImage}
                alt={user?.username || "User"}
              />
              <AvatarFallback>
                {getInitials(user?.fullName || user?.username)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </Link>
      <p className="text-xs text-center mt-1 truncate max-w-[70px] md:max-w-[80px]">
        {user?.username}
      </p>
    </div>
  );
}

export default Story;
