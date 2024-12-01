import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import { X } from "lucide-react";
import { Button } from "./ui/button";

function RightSideBarModal({ isOpen, onClose }) {
  const { user } = useSelector((store) => store.auth);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-75 md:hidden">
      <div className="w-full bg-black p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Suggestions</h1>
          <button onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>
        <div className="flex item-center gap-2 mb-4">
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
        <SuggestedUsers />
        <Button onClick={onClose} className="mt-4 bg-blue-500">
          Go to Home
        </Button>
      </div>
    </div>
  );
}

export default RightSideBarModal;
