import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import "../index.css";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
} from "@/redux/authSlice";



function Post({ post }) {
  const [text, setText] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id));
  const [postLike, setPostLike] = useState(post?.likes?.length);
  const [comment, setComment] = useState(post?.comments);
  const [animate, setAnimate] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // track if the video is playing
  const [isFollowing, setIsFollowing] = useState(
    user?.following?.includes(post?.author?._id)
  );
  const videoRef = useRef(null);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const handleVideoPostMute = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setIsMuted((prevMuted) => {
        const newMuteStatus = !prevMuted;
        videoElement.muted = newMuteStatus;
        return newMuteStatus;
      });
    }
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


  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        setAnimate(true);
        setTimeout(() => {
          setAnimate(false);
        }, 300);

        const updatedPostData = posts.map((p) =>
          p?._id === post?._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user?._id],
              }
            : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);

        if (!liked) {
          setShowHeart(true);
          setTimeout(() => {
            setShowHeart(false);
          }, 1000); // Duration of the animation
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDoubleClick = () => {
    likeOrDislikeHandler();
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p?._id === post?._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatePostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatePostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPostData = posts.map((p) =>
          p?._id === post?._id ? { ...p, bookmarked: !p.bookmarked } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      // console.log("follow/unfollow button clicked")
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${post?.author?._id}`,
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
          ? user?.following?.filter((id) => id !== post?.author?._id)
          : [...user.following, post?.author?._id];

        dispatch(setAuthUser({ ...user, following: updatedFollowing }));

        //for updating profile user
        const updatedFollowers = isFollowing
          ? post?.author?.followers?.filter((id) => id !== user?._id) // Remove follower
          : [...post?.author?.followers, user?._id]; // Add follower

        dispatch(
          setUserProfile({ ...post?.author, followers: updatedFollowers })
        );

        //for updating the suggested users list
        const updatedSuggestedUsers = suggestedUsers?.map((suggUser) =>
          suggUser?._id === post?.author?._id
            ? {
                ...suggUser,
                followers: suggUser?.followers?.includes(user?._id)
                  ? suggUser?.followers?.filter((id) => id !== user?._id) // Unfollow
                  : [...suggUser?.followers, user?._id], // Follow
              }
            : suggUser
        );
        dispatch(setSuggestedUsers(updatedSuggestedUsers)); // upto date with the suggested Users

        setIsFollowing((prev) => !prev); // Toggle following state
        toast.success(response.data.message); // Success toast
      }
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
      toast.error("Something went wrong!"); // Optional: Error toast
    }
  };

  useEffect(() => {
    setBookmarked(user?.bookmarks?.includes(post._id));
  }, [user, post._id]);


  // IntersectionObserver to play and pause the video when it enters and leaves the screen
  useEffect(() => {
    const videoElement = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play the video when it enters the viewport, no matter what state it was in
            if (videoElement && videoElement.paused) {
              videoElement.play();
              setIsPlaying(true); // Set the state to playing
            }
          } else {
            // Pause the video when it leaves the viewport
            if (videoElement) {
              videoElement.pause();
              setIsPlaying(false); // Set the state to paused
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []); // Ensure the observer takes into account the `isPlaying` state


  return (
    <div className="my-8 w-full max-w-md mx-auto text-white px-2 md:px-0">
      <div className="flex items-center justify-between">
        <div className="flex item-center gap-2 ">
          <Link to={`/profile/${post?.author?._id}`}>
            <Avatar className="text-black">
              <AvatarImage src={post?.author?.profileImage} alt="post_image" />
              <AvatarFallback>IM</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post?.author?._id}`}>
              <h1 className="font-bold">{post?.author?.username}</h1>
            </Link>

            {post?.author?._id === user?._id ? (
              <Badge
                variant="secondary"
                className="font-bold bg-gray-300 text-black"
              >
                My Vibe
              </Badge>
            ) : null}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="bg-black text-white flex flex-col items-center text-sm text-center ">
            {post.author?._id !== user?._id && isFollowing ? (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold rounded-xl hover:bg-gray-500"
                onClick={handleUnfollow}
              >
                Unfollow
              </Button>
            ) : (
              ""
            )}

            <Link to={`/profile/${post?.author?._id}`}>
              <Button
                variant="ghost"
                className="cursor-pointer w-fit rounded-xl hover:bg-gray-500"
              >
                About this account
              </Button>
            </Link>

            {user && user?._id === post?.author?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit rounded-xl font-bold hover:bg-gray-500"
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative ">
        {post?.video ? (
          <video
          onClick={handleVideoPostPlayNPause}
          ref={videoRef}
          className="rounded-sm my-2 w-full aspect-square object-contain"
          src={post?.video}
          alt="post_video"
          muted={isMuted}
          loop
          autoPlay
        />
        ) : (
          <img
            className="rounded-sm my-2 w-full aspect-square object-contain"
            src={post?.image}
            alt="post_image"
            onDoubleClick={handleDoubleClick} // Optional: Double-click to like functionality
          />
        )}
        {
          post?.video ? (

        <button
        onClick={handleVideoPostMute}
        className="absolute bottom-4 right-4 p-1 bg-opacity-50 bg-gray-900 rounded-full"
      >
        {isMuted ? (
          <span role="img" aria-label="mute"><i className="fas fa-volume-mute"></i></span> // Mute Symbol
        ) : (
          <span role="img" aria-label="unmute"> <i className="fas fa-volume-up"></i></span> // Unmute Symbol
        )}
      </button>
          ) : ""
        } 
        {showHeart && <FaHeart className="heart-animation" />}
      </div>

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3 ">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className={`cursor-pointer text-red-600 hover:text-red-700 ${
                animate ? "pop-animation" : ""
              }`}
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className={`cursor-pointer hover:text-gray-400 ${
                animate ? "pop-animation" : ""
              }`}
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpenComment(true);
            }}
            className="cursor-pointer hover:text-gray-400"
          />
          <Send className="cursor-pointer hover:text-gray-400" />
        </div>
        {bookmarked ? (
          <Bookmark
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-400"
          />
        ) : (
          <Bookmark
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-400"
          />
        )}
      </div>
      <span className="font-medium text-sm mb-2 block">{postLike} likes</span>
      <p>
        <span className="font-medium text-sm">{post?.author?.username}</span>{" "}
        &nbsp; {post?.caption}
      </p>
      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpenComment(true);
        }}
        className="cursor-pointer font-thin text-sm text-gray-400"
      >
        {comment?.length === 0 ? "" : `View all ${comment?.length} comments`}
      </span>
      <CommentDialog
        openComment={openComment}
        setOpenComment={setOpenComment}
      />
      <div className="flex">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full bg-black mt-3"
          value={text}
          onChange={changeEventHandler}
        />
        {text && (
          <span
            onClick={commentHandler}
            id="Postbutton"
            className="text-[#0095F6] text-sm font-bold mt-3 cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
