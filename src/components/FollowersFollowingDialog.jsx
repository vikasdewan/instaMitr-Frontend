import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const FollowersFollowingDialog = ({
  type = "followers",
  userProfile,
  onClose,
}) => {
  const dialogRef = useRef(null);
  const usersList =
    type === "followers" ? userProfile?.followers : userProfile?.following;
  console.log(usersList);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-transparent bg-opacity-60 flex justify-center items-center">
      <div
        ref={dialogRef}
        className="bg-gray-900 text-white p-4 rounded-xl w-80 max-h-[80vh] overflow-y-auto shadow-xl"
      >
        <h2 className="text-lg font-bold capitalize mb-4">{type}</h2>
        {usersList?.length === 0 ? (
          <p className="text-sm text-gray-400">No {type} yet.</p>
        ) : (
          usersList?.map((user) => (
            <Link to={`/profile/${user?._id}`} onClick={onClose}>
              <div key={user.username} className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold">{user.username}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowersFollowingDialog;
