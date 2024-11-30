import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";

export const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetching suggested users from Redux store
  const { suggestedUsers } = useSelector((store) => store.auth);

  // Filter users based on the search query
  const filteredUsers = suggestedUsers.filter(
    (suggUser) =>
      suggUser.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to the user's profile page when clicked
  const searchedUserHandler = (user) => {
    navigate(`/profile/${user?._id}`);
  };

  return (
    <div className="flex flex-col items-start px-auto justify-center mx-auto bg-black py-10 text-white w-[70%]">
      {/* Search Bar */}
      <input
        type="text"
        className="w-full p-3 text-black rounded-md border border-gray-300 mb-4"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Display filtered users only when searchQuery is not empty */}
      {searchQuery && filteredUsers.length > 0 ? (
        <ul className="space-y-2">
          {filteredUsers.map((user) => (
            <li
              key={user?._id}
              className="flex  items-center p-2    border-gray-700 cursor-pointer hover:bg-gray-800 rounded-md"
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
