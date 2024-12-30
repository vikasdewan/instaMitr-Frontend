import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader.jsx";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [openPostDialog, setOpenPostDialog] = useState(false); // Manage modal visibility
  const [selectedPost, setSelectedPost] = useState(null); // Store the selected post details
  const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
  

  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/post/all", {
          withCredentials: true,
        });
        setPosts(response.data.posts); // Assuming your API returns a list of posts
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

  // Close the post dialog
  const closeDialog = () => {
    setOpenPostDialog(false);
    setSelectedPost(null);
  };

  // Navigate to individual post page
  const goToPost = (postId) => {
    navigate(`/post/${postId}`); // Navigate to the individual post page
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
      setTimeout(() => { setLoading(false); }, 500); // Adjust the timeout as needed 
      }, []);


  return (

    <>
    {loading ?
     <Loader /> :

    <div className="bg-black min-h-screen p-4">
      {/* Search Bar */}
      <div className="md:hidden flex justify-center mb-6">
        <input
          type="text"
          className="w-full p-3 font-bold text-white rounded-md border bg-black border-gray-500 "
          placeholder="🔍Search"
          onClick={handleSearchClick} // Navigate to search page on click
        />
      </div>

      {/* Modal Dialog for Post Details */}
      {openPostDialog && selectedPost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 mx-2">
          <div className="bg-black p-6 rounded-lg w-96 md:h-96">
            <h3 className="text-xl font-semibold mb-4">{selectedPost.title}</h3>
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-64 object-fill rounded-lg mb-4"
            />
            <p className="text-gray-700 mb-4">{selectedPost.description}</p>
            <div className="flex justify-end">
              <button
                onClick={closeDialog}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post?._id}
              className="relative group cursor-pointer"
              onClick={() => openDialog(post)} // Open the dialog with the selected post
            >
              <img
                src={post?.image}
                alt="Post"
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-all duration-300 transform group-hover:scale-105"
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-between items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-4">
                  <button className="text-white">
                    <i className="fas fa-heart"></i> {/* You can replace with an actual icon */}
                  </button>
                  <button className="text-white">
                    <i className="fas fa-comment"></i> {/* You can replace with an actual icon */}
                  </button>
                  <button className="text-white">
                    <i className="fas fa-share-alt"></i> {/* You can replace with an actual icon */}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No posts to show</p>
        )}
      </div>
       <button
        onClick={goToHome}
        className="fixed bottom-5 right-5 bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition duration-300"
        title="Go to Home"
      >
        🏠
      </button>
    </div>
    
    }
    </>
  );
};

export default Explore;
