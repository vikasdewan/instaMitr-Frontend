import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import {
  AtSign,
  Bookmark,
  Grid,
  Heart,
  MessageCircle,
  MoreHorizontal,
  PlaySquare,
  Plus,
  Settings,
  User,
  UserSquare,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { FaComment, FaHeart,   } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import { setAuthUser, setSuggestedUsers, setUserProfile } from "@/redux/authSlice";
// import { setSelectedUser } from "@/redux/chatSlice";

function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");

  const {suggestedUsers, userProfile,user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id ;
  const [isFollowing, setIsFollowing] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [openPostDialog, setOpenPostDialog] = useState(false);  // state to control modal visibility
  const [selectedPost, setSelectedPost] = useState(null);  
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setIsFollowing(user?.following?.includes(userProfile?._id)); // Check if logged-in user is following the profile
  }, [userProfile, user]);



  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

   // Handler for follow/unfollow
   const handleFollowToggle = async () => {
    try {
      // console.log("follow/unfollow button clicked")
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`,
        {}, // No body data required
        {
          withCredentials: true, // Send cookies with the request
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token if needed
          },
        }
      );

      if (response.data.success) {
       
        //for updating loggedin user
        const updatedFollowing = isFollowing
        ? user?.following.filter((id) => id !== userProfile?._id)
        : ([...user.following, userProfile?._id])
        
        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
       
       //for updating profile user
        const updatedFollowers = isFollowing
        ? userProfile?.followers.filter((id) => id !== user?._id) // Remove follower
        : [...userProfile?.followers, user?._id]; // Add follower
        
        dispatch(setUserProfile({...userProfile, followers:updatedFollowers}))

        //for updating the suggested users list 
        const updatedSuggestedUsers = suggestedUsers.map((suggUser) =>
          suggUser?._id === userProfile?._id
            ? {
                ...suggUser,
                followers: suggUser.followers.includes(user?._id)
                  ? suggUser.followers.filter((id) => id !== user?._id) // Unfollow
                  : [...suggUser.followers, user?._id], // Follow
              }
            : suggUser
        );
       dispatch(setSuggestedUsers(updatedSuggestedUsers)) // upto date with the suggested Users

        setIsFollowing((prev) => !prev); // Toggle following state
        toast.success(response.data.message); // Success toast
      }
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
      toast.error("Something went wrong!"); // Optional: Error toast
    }
  };

  const handleMessage = () =>{
    console.log("message handler called")
    navigate("/chat", { state: { selectedUser: userProfile } });
  }

   // Open post dialog
   const openPostDialogHandler = (post) => {
    setSelectedPost(post);
    setOpenPostDialog(true);
  };

  // Close post dialog
  const closeDialog = () => {
    setOpenPostDialog(false);
    setSelectedPost(null);
  };

  const handleVideoPostPlayNPause = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play(); // Play the video
        setIsPlaying(true);
      } else {
        videoElement.pause(); // Pause the video
        setIsPlaying(false);
      }
    }
  };


  return (

    
    <div className="text-white bg-black flex flex-col mx-auto w-full md:min-w-[94.8%] justify-center md:ml-10 md:pl-10">

      
  <div className="flex flex-col gap-10 py-8 h-[100%]">
    <div className="md:grid md:grid-cols-2 gap-3">
      {/* Profile Picture Section */}
      <section className="flex items-center justify-center mt-3 md:ml-80">
        <Avatar className="h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40">
          <AvatarImage src={userProfile?.profileImage} alt="profile_Img" />
          <AvatarFallback>IM</AvatarFallback>
        </Avatar>
      </section>

      {/* Profile Info Section */}
      <section className="mt-5 sm:mt-0">
        <div className="flex flex-col gap-5 text-center md:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center md:justify-start gap-2">
            <span className="font-semibold text-xl">{userProfile?.username}</span>
            {isLoggedInUserProfile ? (
              <div className="flex items-center justify-center flex-wrap gap-2">
                <Link to="/account/edit">
                  <Button className="bg-gray-700 text-white font-semibold hover:bg-gray-800 h-8" variant="secondary">
                    Edit Profile
                  </Button>
                </Link>
                <Button className="hover:bg-gray-800 h-8 bg-gray-700 text-white font-semibold" variant="secondary">
                  View archive
                </Button>
              </div>
            ) : isFollowing ? (
              <div className="flex items-center justify-center flex-wrap gap-2">
                <Button onClick={handleFollowToggle} className="bg-gray-700 text-white font-semibold hover:bg-gray-800 h-8" variant="secondary">
                  Unfollow
                </Button>
                <Button onClick={handleMessage} className="hover:bg-gray-800 h-8 bg-gray-700 text-white font-semibold" variant="secondary">
                  Message
                </Button>
                <div className="flex items-end hover:text-gray-200 cursor-pointer">
                  <User className="text-2xl" />
                  <Plus className="text-2xl size-3" />
                </div>
                <MoreHorizontal className="text-2xl hover:text-gray-200 cursor-pointer" />
              </div>
            ) : (
              <div className="flex items-center justify-center flex-wrap gap-2">
                <Button onClick={handleFollowToggle} className="bg-blue-600 text-white font-semibold hover:bg-blue-700 h-8" variant="secondary">
                  Follow
                </Button>
                <MoreHorizontal className="text-2xl hover:text-gray-200 cursor-pointer" />
              </div>
            )}
          </div>

          <div className="flex flex-row  items-center justify-center md:justify-start gap-4 md:gap-9">
            <p>
              <span className="font-semibold pr-1 text-lg">{userProfile?.posts?.length}</span> posts
            </p>
            <p>
              <span className="font-semibold pr-1 text-lg">{userProfile?.followers?.length}</span> followers
            </p>
            <p>
              <span className="font-semibold pr-1 text-lg">{userProfile?.following?.length}</span> following
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-semibold">{userProfile?.bio || "bio here..."}</span>
            <Badge className="w-fit bg-gray-600 text-white hover:bg-gray-700 cursor-pointer" variant="secondary">
              <AtSign className="size-4" />
              <span>{userProfile?.username}</span>
            </Badge>
            <span>MERN Stack💻 | DSA in JAVA🖥️</span>
          </div>
        </div>
      </section>
    </div>

    {/* Tabs Section */}
    <div className="mr-5 ml-5 sm:mr-44 sm:ml-48">
      <div className={`border-t border-t-gray-400 ${userProfile?.[activeTab]?.length !== 0 ? 'md:ml-10 ' : ''}`}></div>
      <div className="flex items-center justify-center gap-4 sm:gap-10 text-sm">
        <div
          onClick={() => handleTabChange("posts")}
          className="flex cursor-pointer items-center justify-center gap-1"
        >
          <Grid className="w-5 h-5 font-normal" />
          <span className={`py-3 text-gray-400 ${activeTab === "posts" ? "font-bold text-white" : ""}`}>
            POSTS
          </span>
        </div>
        <div
          onClick={() => handleTabChange("bookmarks")}
          className="flex cursor-pointer items-center justify-center gap-1"
        >
          <Bookmark className="w-5 h-5 font-normal" />
          <span className={`py-3 text-gray-400 ${activeTab === "bookmarks" ? "font-bold text-white" : ""}`}>
            SAVED
          </span>
        </div>
        <div className="flex cursor-pointer items-center justify-center gap-1">
          <PlaySquare className="w-5 h-5 font-normal" />
          <span className="py-3 text-gray-400">REELS</span>
        </div>
        <div className="flex cursor-pointer items-center justify-center gap-1">
          <UserSquare className="w-5 h-5" strokeWidth={1.5} />
          <span className="py-3 text-gray-400">TAGGED</span>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 bg-black pl-1 sm:pl-[8%]">
        {displayedPost?.map((post) => (
          <div 
          key={post?.id} 
          className="relative group cursor-pointer"
          onClick={() => openPostDialogHandler(post)}
          >
            
            {post?.video ? (
                      <video
                        src={post?.video}
                        className="rounded-sm my-2 w-full aspect-square object-cover"
                        muted
                        loop
                      />
                    ) : (
                      <img
                        src={post?.image}
                        alt="Post"
                        className="rounded-sm my-2 w-full aspect-square object-cover"
                      />
                    )}
                     <div className="absolute top-2 right-2 bg-black bg-opacity-50 opacity-70 text-white rounded-full p-2 z-10">
                    {post?.video ? (
                      <i className="fas fa-video"></i>
                    ) : (
                      <i className="fas fa-image"></i>
                    )}
                  </div>
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center text-white space-x-4 text-lg font-bold">
                <button className="flex items-center gap-2 hover:text-gray-300">
                  <FaHeart />
                  <span>{post?.likes.length}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-gray-300">
                  <FaComment />
                  <span>{post?.comments.length}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  

  {openPostDialog && selectedPost && (
            <div
              className="fixed inset-0   bg-opacity-75 flex justify-center items-center z-50  "
              onClick={closeDialog} // Close dialog on clicking outside
            >
              <div
                className="bg-gray-900 p-2 rounded-lg md:w-1/4 w-96 relative shadow-xl"
                onClick={(e) => e.stopPropagation()} // Prevent closing when interacting inside dialog
              >
       
                {selectedPost?.video ? (
                  <div className="relative">
                    <video
                      src={selectedPost?.video}
                      className="w-full h-[500px] md:h-[550px] pt-4 md:py-10 object-contain rounded-lg mb-4"
                      muted={isMuted}
                      ref={videoRef}
                      onClick={handleVideoPostPlayNPause}
                      autoPlay
                      loop
                    />
                    <button
                      className="absolute bottom-2 right-2 bg-gray-700 text-white rounded-full p-2"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <i className="fas fa-volume-mute"></i>
                      ) : (
                        <i className="fas fa-volume-up"></i>
                      )}
                    </button>
                  </div>
                ) : (
                  <img
                    src={selectedPost?.image}
                    alt={selectedPost?.caption}
                    className="w-full h-96 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="text-gray-400 mb-4">{selectedPost?.caption}</p>
              </div>
            </div>
          )}

</div>

  );
}

export default Profile;
