import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [showSymbol, setShowSymbol] = useState(false);
  const [symbol, setSymbol] = useState(""); // "mute" or "unmute"
  const videoRef = useRef([]);
  const navigate = useNavigate();
  let longPressTimeout;

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/post/all", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        const filteredReels = res.data.posts.filter(
          (post) => post.video && post.video.trim() !== ""
        );
        const shuffledReels = shuffleArray(filteredReels);
        setReels(shuffledReels);
      } catch (error) {
        console.error("Error fetching reels:", error);
      }
    };

    fetchReels();
  }, []);

  const handleVideoEnd = () => {
    setCurrentReelIndex((prevIndex) => (prevIndex + 1) % reels.length);
  };

  const handleToggleSound = (index) => {
    const video = videoRef.current[index];
    if (video) {
      video.muted = !video.muted;
      setSymbol(video.muted ? "mute" : "unmute");
      setShowSymbol(true);

      // Hide the symbol after 1.5 seconds
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

  const goToHome = () => {
    navigate("/");
  };

  const handleLongPressStart = (index) => {
    longPressTimeout = setTimeout(() => {
      const video = videoRef.current[index];
      if (video) {
        video.pause();
      }
    }, 500); // Long press starts after 500ms
  };

  const handleLongPressEnd = (index) => {
    clearTimeout(longPressTimeout);
    const video = videoRef.current[index];
    if (video && video.paused) {
      video.play();
    }
  };

  return (
    <div
      {...swipeHandlers}
      onWheel={handleMouseScroll}
      className="flex flex-col items-center h-screen overflow-hidden relative bg-gradient-to-r from-blue-900 via-black  to-blue-900"
    >
      {reels.length > 0 && (
        <div className="relative md:w-1/4 w-full h-full flex items-center justify-center">
          <video
            ref={(el) => (videoRef.current[currentReelIndex] = el)}
            src={reels[currentReelIndex].video}
            controls={false}
            autoPlay
            loop
            onEnded={handleVideoEnd}
            className="w-full h-[90vh] object-fill rounded-lg p-1"
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
        </div>
      )}

      <button
        onClick={goToHome}
        className="fixed bottom-5 right-5 bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition duration-300"
        title="Go to Home"
      >
        🏠
      </button>
    </div>
  );
};

export default Reels;
