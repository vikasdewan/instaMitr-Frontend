import React, { useEffect, useState } from "react";
import Feed from "./Feed.jsx";
import RightSideBar from "./RightSideBar.jsx";
import { Outlet } from "react-router-dom";
import useGetAllPost from "@/hooks/useGetAllPost.jsx";
import useGetSuggestUsers from "@/hooks/useGetSuggestUsers.jsx";
import Loader from "./Loader.jsx";

const Home = () => {
  const [loading, setLoading] = useState(true);

  // ✅ Custom hooks must be called directly at the top level
  useGetAllPost();        // These hooks should internally manage when to fetch (usually with useEffect inside)
  useGetSuggestUsers();

  useEffect(() => {
    // Simulate a delay to show loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="text-white flex">
          <div className="flex-grow bg-black text-white">
            <Feed />
            <Outlet />
          </div>
          <RightSideBar />
        </div>
      )}
    </>
  );
};

export default Home;
