import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader, CommentSection } from "../common/index.js";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/index";
import { APP_BASE_URL } from "@/config.js";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/index";
import { SearchTab } from "../index.js";
import { Search } from "lucide-react";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/post/all`,
          {
            withCredentials: true,
          }
        );
        const Allposts = response.data.posts;
        const shuffledPosts = shuffleArray(Allposts);
        setPosts(shuffledPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const openDialog = (post) => {
    setSelectedPost(post);
    setOpenPostDialog(true);
  };

  const closeDialog = () => {
    setOpenPostDialog(false);
    setSelectedPost(null);
  };

  const handleSearchClick = () => {
    setOpenSearch(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleVideoPostPlayNPause = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={`bg-black min-h-screen p-1 md:pl-96 md:pr-40 md:py-2`}>
          {/* Mobile Search Bar */}
          <div className="md:hidden flex justify-center mb-6">
            <input
              type="text"
              className="w-full p-3 font-bold text-white  rounded-md border bg-black border-gray-600"
              placeholder="🔍 Search"
              onClick={handleSearchClick}
              readOnly
            />
          </div>

          {/* Sheet for Mobile Search */}
          <Sheet open={openSearch} onOpenChange={setOpenSearch}>
            <SheetContent
              side="left"
              className="bg-black border-r border-white w-[80%] sm:w-[60%] md:w-[400px] text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-xl text-white">Search</SheetTitle>
              </SheetHeader>
              <SearchTab setOpenSearch={setOpenSearch} />
            </SheetContent>
          </Sheet>

          {/* Posts Grid */}
          <div
            className={`grid grid-cols-2 mt-5 md:grid-cols-3 lg:grid-cols-3 gap-1 md:gap-1 ${
              openPostDialog ? "filter blur-sm" : ""
            }`}
          >
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post?._id}
                  className="relative group cursor-pointer bg-black rounded-sm shadow-lg overflow-hidden"
                  onClick={() => openDialog(post)}
                >
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 opacity-50 text-white rounded-full p-1 z-10">
                    {post?.video ? (
                      <i className="fas fa-video"></i>
                    ) : (
                      <i className="fas fa-image"></i>
                    )}
                  </div>

                  {post?.video ? (
                    <video
                      src={post?.video}
                      className="w-full h-64 object-cover transition-all duration-300 transform group-hover:scale-105"
                      muted
                      loop
                    />
                  ) : (
                    <img
                      src={post?.image || post?.images[0]}
                      alt="Post"
                      className="w-full h-64 object-cover transition-all duration-300 transform group-hover:scale-105"
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
              className="fixed inset-0 bg-transparent bg-opacity-75 flex justify-center items-center z-50"
              onClick={closeDialog}
            >
              <div
                className="bg-black rounded-lg shadow-xl w-fit max-w-4xl flex flex-col md:flex-row m-4 md:m-8 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-1 p-4 md:p-6">
                  {selectedPost?.video ? (
                    <div className="relative">
                      <video
                        src={selectedPost?.video}
                        className="w-full h-[450px] md:h-[500px] object-contain rounded-lg mb-4"
                        muted={isMuted}
                        ref={videoRef}
                        onClick={handleVideoPostPlayNPause}
                        autoPlay
                        loop
                      />
                      <button
                        className="absolute bottom-3 right-3 bg-gray-700 text-white rounded-full p-2"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? (
                          <i className="fas fa-volume-mute"></i>
                        ) : (
                          <i className="fas fa-volume-up"></i>
                        )}
                      </button>
                    </div>
                  ) : selectedPost?.images?.length > 1 ? (
                    <div className="w-full max-h-[500px] aspect-square overflow-hidden rounded-lg mb-4">
                      <Carousel className="w-full h-full flex items-center justify-center">
                        <CarouselContent className="h-full">
                          {selectedPost.images.map((img, idx) => (
                            <CarouselItem
                              key={idx}
                              className="flex justify-center items-center h-full"
                            >
                              <div className="h-full w-full flex items-center justify-center">
                                <img
                                  src={img}
                                  alt={`profile_post_image_${idx}`}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </Carousel>
                    </div>
                  ) : selectedPost?.image || selectedPost?.images ? (
                    <img
                      src={selectedPost.image || selectedPost.images[0]}
                      alt={selectedPost?.title}
                      className="w-full h-[250px] md:h-[500px] object-contain rounded-lg mb-4"
                    />
                  ) : null}

                  <p className="text-gray-400 mb-2">{selectedPost?.caption}</p>
                </div>

                <div className="hidden md:flex md:w-[400px] bg-black border-l border-gray-700 flex-col max-h-[600px] p-4 overflow-y-auto">
                  <CommentSection postId={selectedPost?._id} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Explore;
