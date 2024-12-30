import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/reels/random");
        setReels(res.data);
      } catch (error) {
        console.error("Error fetching reels:", error);
      }
    };

    fetchReels();
  }, []);

  const handleVideoEnd = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    } else {
      setCurrentReelIndex(0);
    }
  };

  const handlePlayPause = (index) => {
    const video = videoRef.current[index];
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleSound = (index) => {
    const video = videoRef.current[index];
    video.muted = !video.muted;
  };

  const nextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    }
  };

  const prevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
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

  return (
    <div
      {...swipeHandlers}
      onWheel={handleMouseScroll}
      className="flex flex-col items-center h-screen overflow-hidden relative bg-black"
    >
      {reels.length > 0 && (
        <div className="relative md:w-1/4 w-80 h-full flex items-center justify-center">
          <video
            ref={(el) => (videoRef.current[currentReelIndex] = el)}
            src={reels[currentReelIndex].videoUrl}
            controls={false}
            autoPlay
            muted
            loop
            onEnded={handleVideoEnd}
            className="w-full h-[90vh] object-cover rounded-lg"
            onClick={() => handlePlayPause(currentReelIndex)}
          />
          {/* <div className="absolute bottom-6 left-1 bg-black bg-opacity-50 text-white text-sm p-2 rounded-md">
            <h4 className="font-semibold">{reels[currentReelIndex].user}</h4>
          </div> */}
        </div>
      )}

      {/* Cute Home Button */}
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
