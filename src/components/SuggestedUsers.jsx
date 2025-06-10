import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setAuthUser, setSuggestedUsers } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { APP_BASE_URL } from "@/config.js";

function SuggestedUsers() {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [showAll, setShowAll] = useState(false); // toggle for "See More"

  const visibleUsers = showAll ? suggestedUsers : suggestedUsers.slice(0, 5);

  const handleFollow = async (suggUserId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${suggUserId}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const updatedUsers = suggestedUsers.map((suggUser) =>
          suggUser?._id === suggUserId
            ? {
                ...suggUser,
                followers: suggUser.followers.includes(user?._id)
                  ? suggUser.followers.filter((id) => id !== user?._id)
                  : [...suggUser.followers, user?._id],
              }
            : suggUser
        );

        dispatch(setSuggestedUsers(updatedUsers));
        const updatedFollowing = [...user.following, suggUserId];
        dispatch(setAuthUser({ ...user, following: updatedFollowing }));

        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-gray-400 text-sm">Suggested for you</h1>
      </div>

      {visibleUsers.map((suggUser) => {
        const isFollowing = suggUser.followers.includes(user?._id);

        return (
          <div
            key={suggUser._id}
            className="flex items-center justify-between mt-2 pt-3 animate-fade-in"
          >
            <div className="flex items-center gap-3">
              <Link to={`/profile/${suggUser?._id}`}>
                <Avatar className="text-black">
                  <AvatarImage src={suggUser?.profileImage} alt="post_image" />
                  <AvatarFallback>IM</AvatarFallback>
                </Avatar>
              </Link>
              <Link to={`/profile/${suggUser?._id}`}>
                <div className="w-64">
                  <h1 className="font-bold text-sm">{suggUser?.username}</h1>
                  <span className="text-gray-400 text-sm break-words w-full">
                    {suggUser?.bio || "Bio Here...."}
                  </span>
                </div>
              </Link>
            </div>

            <button
              className={`${
                isFollowing
                  ? "text-gray-500 cursor-default"
                  : "text-blue-500 cursor-pointer"
              } font-semibold text-xs`}
              onClick={() => !isFollowing && handleFollow(suggUser?._id)}
              disabled={isFollowing}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        );
      })}

      {suggestedUsers.length > 5 && (
        <div className="mt-2 text-center">
          <button
            className="text-sm text-blue-400 font-medium hover:underline transition duration-300 ease-in-out"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "See Less" : "See More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default SuggestedUsers;
  