import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Badge,
} from "../ui/index.js";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice.js";
import "../../index.css";

import { Link } from "react-router-dom";
import {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
} from "@/redux/authSlice";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { APP_BASE_URL } from "@/config.js";

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
  const [isPlaying, setIsPlaying] = useState(true); // Track if the video is playing
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user?.following?.includes(post?.author?._id)
  );

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const videoRef = useRef(null);

  const changeEventHandler = (e) => {
    setText(e.target.value);
    setShowEmojiPicker(false); // optional
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
        videoElement.play();
        setIsPlaying(true);
      } else {
        videoElement.pause();
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
          }, 1000);
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

  const handleFollowToggle = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${post?.author?._id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const updatedFollowing = isFollowing
          ? user?.following?.filter((id) => id !== post?.author?._id)
          : [...(user?.following || []), post?.author?._id];

        dispatch(setAuthUser({ ...user, following: updatedFollowing }));

        const updatedFollowers = isFollowing
          ? post?.author?.followers?.filter((id) => id !== user?._id)
          : [...(post?.author?.followers || []), user?._id];

        dispatch(
          setUserProfile({ ...post?.author, followers: updatedFollowers })
        );

        const updatedSuggestedUsers = suggestedUsers?.map((suggUser) =>
          suggUser?._id === post?.author?._id
            ? {
                ...suggUser,
                followers: isFollowing
                  ? suggUser?.followers?.filter((id) => id !== user?._id)
                  : [...(suggUser?.followers || []), user?._id],
              }
            : suggUser
        );

        dispatch(setSuggestedUsers(updatedSuggestedUsers));

        setIsFollowing((prev) => !prev);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
      toast.error("Something went wrong!");
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
            if (videoElement && videoElement.paused) {
              videoElement.play();
              setIsPlaying(true);
            }
          } else {
            if (videoElement) {
              videoElement.pause();
              setIsPlaying(false);
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
  }, []);

  // Pause video when CommentDialog opens, resume when it closes
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (openComment) {
        // Pause the video when the comment dialog opens
        videoElement.pause();
        setIsPlaying(false);
      } else if (isPlaying) {
        // Resume the video when the dialog closes, only if it was playing before
        videoElement.play();
        setIsPlaying(true);
      }
    }
  }, [openComment]); // Trigger when openComment changes

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
            {post.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className={`cursor-pointer border-none w-fit font-bold rounded-xl    ${
                  isFollowing ? "text-[#ED4956]" : "text-blue-500"
                }  ${isFollowing ? "hover:bg-red-500" : "hover:bg-blue-500"}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
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
                className="cursor-pointer w-fit rounded-xl bg-red-500 font-bold hover:bg-red-500"
                onClick={deletePostHandler}
              >
                Delete the post
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
            className="rounded-sm my-2 w-full h-[560px] aspect-square object-contain"
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
            onDoubleClick={handleDoubleClick}
          />
        )}
        {post?.video ? (
          <button
            onClick={handleVideoPostMute}
            className="absolute bottom-4 right-4 p-1 bg-opacity-50 bg-gray-900 rounded-full"
          >
            {isMuted ? (
              <span role="img" aria-label="mute">
                <i className="fas fa-volume-mute"></i>
              </span>
            ) : (
              <span role="img" aria-label="unmute">
                <i className="fas fa-volume-up"></i>
              </span>
            )}
          </button>
        ) : (
          ""
        )}
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
        <span className="font-medium text-sm">{post?.author?.username}</span>  {" "}
        {post?.caption}
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
      <div className="flex relative">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full bg-black mt-3 pr-16"
          value={text}
          onChange={changeEventHandler}
        />

        <div className="absolute right-2 top-[14px] flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-gray-200"
          >
            <Smile size={18} />
          </button>

          {text && (
            <span
              onClick={commentHandler}
              id="Postbutton"
              className="text-[#0095F6] text-sm font-bold cursor-pointer"
            >
              Post
            </span>
          )}
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-[40px] right-0 z-50">
            <EmojiPicker
              height={350}
              width={300}
              searchDisabled
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
              onEmojiClick={handleEmojiClick}
              theme="dark"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
