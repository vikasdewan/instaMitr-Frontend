import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import ReelComments from "./ReelComments";
import { APP_BASE_URL } from "@/config.js";

const Reels = () => {
  const dispatch = useDispatch();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [showSymbol, setShowSymbol] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [currentReelForComments, setCurrentReelForComments] = useState(null);
  const [symbol, setSymbol] = useState(""); // "mute" or "unmute"
  const [likedState, setLikedState] = useState([]);
  const videoRef = useRef([]);
  const navigate = useNavigate();
  let longPressTimeout;

  // Derive reels from posts
  const reels = useMemo(() => {
    return posts.filter((post) => post.video && post.video.trim() !== "");
  }, [posts]);

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  // Initial fetch and shuffle
  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/post/all`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const videoPosts = res.data.posts.filter(
          (post) => post.video && post.video.trim() !== ""
        );

        const shuffled = shuffleArray(videoPosts);
        dispatch(setPosts(shuffled));

        // Initialize liked state
        const initialLikedState = shuffled.map((reel) =>
          reel.likes.includes(user?._id)
        );
        setLikedState(initialLikedState);
      } catch (error) {
        console.error("Error fetching reels:", error);
      }
    };

    fetchReels();
  }, [user, dispatch]);

  const handleVideoEnd = () => {
    setCurrentReelIndex((prevIndex) => (prevIndex + 1) % reels.length);
  };

  const handleToggleSound = (index) => {
    const video = videoRef.current[index];
    if (video) {
      video.muted = !video.muted;
      setSymbol(video.muted ? "mute" : "unmute");
      setShowSymbol(true);

      setTimeout(() => {
        setShowSymbol(false);
      }, 1500);
    }
  };

  const nextReel = () => {
    setCurrentReelIndex((prevIndex) => (prevIndex + 1) % reels.length);
  };

  const prevReel = () => {
    setCurrentReelIndex(
      (prevIndex) => (prevIndex - 1 + reels.length) % reels.length
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedUp: nextReel,
    onSwipedDown: prevReel,
    preventDefaultTouchmoveEvent: true,
  });

  const handleMouseScroll = (e) => {
    if (e.deltaY > 0) {
      nextReel();
    } else {
      prevReel();
    }
  };

  const handleLongPressStart = (index) => {
    longPressTimeout = setTimeout(() => {
      const video = videoRef.current[index];
      if (video) {
        video.pause();
      }
    }, 500);
  };

  const handleLongPressEnd = (index) => {
    clearTimeout(longPressTimeout);
    const video = videoRef.current[index];
    if (video && video.paused) {
      video.play();
    }
  };

  const handleCommentClick = (reel) => {
    setCurrentReelForComments(reel);
    setShowComments(true);
  };

  useEffect(() => {
    if (showComments && reels.length > 0) {
      setCurrentReelForComments(reels[currentReelIndex]);
    }
  }, [currentReelIndex, showComments, reels]);

  const likeOrDislikeHandler = async () => {
    try {
      const currentReel = reels[currentReelIndex];
      const isLiked = likedState[currentReelIndex];

      const action = isLiked ? "dislike" : "like";

      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${currentReel._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikedState = [...likedState];
        updatedLikedState[currentReelIndex] = !isLiked;
        setLikedState(updatedLikedState);

        const updatedLikes = isLiked
          ? currentReel.likes.filter((id) => id !== user?._id)
          : [...currentReel.likes, user?._id];

        const updatedPostData = posts.map((p) =>
          p?._id === currentReel._id ? { ...p, likes: updatedLikes } : p
        );

        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log("Error handling like/dislike:", error);
    }
  };

  return (
    <div
      {...swipeHandlers}
      onWheel={(e) => {
        if (!showComments) {
          handleMouseScroll(e);
        }
      }}
      className="flex flex-col items-center h-screen bg-black"
    >
      {reels.length > 0 && (
        <div className="relative md:w-[25%] w-full h-full flex items-center justify-center">
          <video
            ref={(el) => (videoRef.current[currentReelIndex] = el)}
            src={reels[currentReelIndex].video}
            controls={false}
            autoPlay
            loop
            onEnded={handleVideoEnd}
            className="w-full md:h-[90vh] h-[100vh] object-fill rounded-lg"
            onPointerDown={() => handleLongPressStart(currentReelIndex)}
            onPointerUp={() => handleLongPressEnd(currentReelIndex)}
            onClick={() => handleToggleSound(currentReelIndex)}
          />

          {showSymbol && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 text-white text-3xl font-bold p-1 rounded-full">
                {symbol === "mute" ? (
                  <i className="fas fa-volume-mute"></i>
                ) : (
                  <i className="fas fa-volume-up"></i>
                )}
              </div>
            </div>
          )}

          <div className="absolute bottom-24 left-3 text-white z-50">
            <Link to={`/profile/${reels[currentReelIndex]?.author?._id}`}>
              <div className="flex items-center">
                <Avatar className="text-black">
                  <AvatarImage
                    src={reels[currentReelIndex]?.author?.profileImage}
                    alt="post_image"
                  />
                  <AvatarFallback>IM</AvatarFallback>
                </Avatar>
                <span className="font-bold ml-2">
                  {reels[currentReelIndex]?.author?.username}
                </span>
              </div>
            </Link>
            <p className="mt-2 ml-2 text-sm truncate">
              {reels[currentReelIndex]?.caption || "No caption provided."}
            </p>
          </div>

          <div className="absolute bottom-16 right-5 z-50 flex flex-col items-center space-y-3 text-white">
            <button onClick={likeOrDislikeHandler}>
              {likedState[currentReelIndex] ? (
                <AiFillHeart size={30} className="text-red-500" />
              ) : (
                <AiOutlineHeart size={30} className="hover:text-red-500" />
              )}
              <span className="text-xs mt-1">
                {reels[currentReelIndex].likes.length}
              </span>
            </button>
            <button onClick={() => handleCommentClick(reels[currentReelIndex])}>
              <AiOutlineComment size={30} className="hover:text-blue-500" />
              <span className="text-xs mt-1">
                {reels[currentReelIndex]?.comments.length}
              </span>
            </button>
            <button>
              <AiOutlineShareAlt size={30} className="hover:text-green-500" />
            </button>
          </div>
        </div>
      )}

      {showComments && currentReelForComments && (
        <ReelComments
          reel={currentReelForComments}
          onClose={() => {
            setShowComments(false);
            setCurrentReelForComments(null);
          }}
          user={user}
        />
      )}
    </div>
  );
};

export default Reels;
