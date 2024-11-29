 
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setAuthUser, setSuggestedUsers } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

function SuggestedUsers() {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
 

 
   // Filter out users that are already in the following list
  // const filteredUsers = suggestedUsers.filter(
  //   (suggUser) => !suggUser?.followers?.includes(user._id)
  // );


  // console.log(filteredUsers);
  
  const handleFollow = async (suggUserId) => {
    try {
      console.log("follow button clicked")
      const response = await axios.post(  
        `http://localhost:8000/api/v1/user/followorunfollow/${suggUserId}`,
        {}, // No body data required
        {
          withCredentials: true, // Send cookies with the request
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token if needed
          },
        }
      );
      
      console.log(response);
      if (response.data.success) {

        const updatedUsers = suggestedUsers.map((suggUser) =>
          suggUser._id === suggUserId
            ? {
                ...suggUser,
                followers: suggUser.followers.includes(user._id)
                  ? suggUser.followers.filter((id) => id !== user._id) // Unfollow
                  : [...suggUser.followers, user._id], // Follow
              }
            : suggUser
        );
         
        dispatch(setSuggestedUsers(updatedUsers));

        const updatedFollowing =  [...user.following, suggUserId];

      dispatch(setAuthUser({ ...user, following: updatedFollowing }));
         // Toggle following state
        toast.success(response.data.message); // Success toast
      }
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
      toast.error("Something went wrong!"); // Optional: Error toast
    }
  }
  
  
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
      {suggestedUsers.map((suggUser) => {
           const isFollowing = suggUser.followers.includes(user._id); 
       
  return (
    <div
      key={suggUser.id}
      className="flex items-center justify-between mt-2  pt-3  "
    >
      {/* Left Section: Avatar and Bio */}
      <div className="flex items-center gap-3">
        <Link to={`/profile/${suggUser?._id}`}>
          <Avatar className="text-black">
            <AvatarImage src={suggUser?.profileImage} alt="post_image" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
        </Link>
        <Link to={`/profile/${suggUser?._id}`}>
          <div>
            <h1 className="font-bold text-sm">{suggUser?.username}</h1>
            <span className="text-gray-400 text-sm">
              {suggUser?.bio || "Bio Here...."}
            </span>
          </div>
        </Link>
      </div>

      {/* Right Section: Follow Button */}
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

    </div>
  );
}

export default SuggestedUsers;
