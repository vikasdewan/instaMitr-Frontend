import React, { useState } from "react";
import { useSelector } from "react-redux"; 
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/index.js";
import { useNavigate } from "react-router-dom";

export const SearchTab = ({setOpenSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { suggestedUsers } = useSelector((store) => store.auth);

  const filteredUsers = suggestedUsers.filter((suggUser) =>
    suggUser.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchedUserHandler = (user) => {
    navigate(`/profile/${user?._id}`);
    setOpenSearch(false); 
  };

  return (
    <div className="w-full mt-2">
      <input
        type="text"
        className="w-full p-2 font-bold text-black rounded-md border border-gray-300 mb-4"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {searchQuery && filteredUsers.length > 0 ? (
        <ul 
        className="space-y-2"
        style={{
            display: "block",
            animation: "fadeIn 0.6s ease-in-out",
          }}
        >
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center p-2 hover:bg-gray-800 cursor-pointer rounded-md"
              onClick={() => searchedUserHandler(user)}
            >
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback>IM</AvatarFallback>
              </Avatar>
              <span>{user?.username}</span>
            </li>
          ))}
        </ul>
      ) : searchQuery ? (
        <p className="text-gray-500">No users found.</p>
      ) : null}
    </div>
  );
};
