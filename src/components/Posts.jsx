import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Posts() {
  const { posts } = useSelector((store) => store.post);

  return (
    <div className="relative">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      <Link to="/suggestedusers">
        <button className="fixed bottom-16 right-0 transform -translate-x-1/2 bg-red-800 text-white size-12  mr-4 rounded-full md:hidden">
           🙋
        </button>
      </Link>
    </div>
  );
}

export default Posts;
