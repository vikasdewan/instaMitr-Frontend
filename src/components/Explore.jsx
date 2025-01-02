import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader.jsx";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [openPostDialog, setOpenPostDialog] = useState(false); // Manage modal visibility
  const [selectedPost, setSelectedPost] = useState(null); // Store the selected post details
  const [isMuted, setIsMuted] = useState(false); // Global mute/unmute state
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);


  // Shuffle function to randomize the order of posts
  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  };


  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/post/all", {
          withCredentials: true,
        });
        const shuffledPosts = shuffleArray(response.data.posts); // Shuffle the posts
        setPosts(shuffledPosts); // Set shuffled posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Open the post dialog with the selected post
  const openDialog = (post) => {
    setSelectedPost(post);
    setOpenPostDialog(true);
  };

  // Close the post dialog when clicking outside
  const closeDialog = () => {
    setOpenPostDialog(false);
    setSelectedPost(null);
  };

  // Navigate to the /search page when the search bar is clicked
  const handleSearchClick = () => {
    navigate("/search"); // Redirect to the /search route
  };

  const goToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    // Simulate a delay for loading content, like fetching data
    setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust the timeout as needed
  }, []);


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
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-black min-h-screen p-4">
          {/* Search Bar */}
          <div className="md:hidden flex justify-center mb-6">
            <input
              type="text"
              className="w-full p-3 font-bold text-white rounded-md border bg-black border-gray-500"
              placeholder="🔍Search"
              onClick={handleSearchClick} // Navigate to search page on click
            />
          </div>

         
          {/* Posts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post?._id}
                  className="relative group cursor-pointer"
                  onClick={() => openDialog(post)} // Open the dialog with the selected post
                >
                  {/* Add symbol for video or image */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 opacity-70 text-white rounded-full p-2 z-10">
                    {post?.video ? (
                      <i className="fas fa-video"></i>
                    ) : (
                      <i className="fas fa-image"></i>
                    )}
                  </div>

                  {post?.video ? (
                    <video
                      src={post?.video}
                      className="w-full h-64 object-cover rounded-lg shadow-lg transition-all duration-300 transform group-hover:scale-105"
                      muted
                      loop
                    />
                  ) : (
                    <img
                      src={post?.image}
                      alt="Post"
                      className="w-full h-64 object-cover rounded-lg shadow-lg transition-all duration-300 transform group-hover:scale-105"
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-white">No posts to show</p>
            )}
          </div>

             {/* Modal Dialog for Post Details */}
          {openPostDialog && selectedPost && (
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 mx-2"
              onClick={closeDialog} // Close dialog on clicking outside
            >
              <div
                className="bg-black p-6 rounded-lg md:w-1/2 w-96 mx-2 relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when interacting inside dialog
              >
                <h3 className="text-xl font-semibold mb-4">{selectedPost.title}</h3>
                {selectedPost.video ? (
                  <div className="relative">
                    <video
                      src={selectedPost.video}
                      className="cover w-full h-96 object-contain rounded-lg mb-4"
                      muted={isMuted}
                      ref={videoRef}
                      onClick={handleVideoPostPlayNPause}
                      autoPlay
                      loop
                    />
                    <button
                      className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2"
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
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="cover w-full h-96 object-fill rounded-lg mb-4"
                  />
                )}
                <p className="text-gray-400 mb-4">{selectedPost.description}</p>
              </div>
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
      )}
    </>
  );
};

export default Explore;
