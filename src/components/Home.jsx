import React, { useEffect, useState } from "react";
import Feed from "./Feed.jsx";
import RightSideBar from "./RightSideBar.jsx";
import { Outlet } from "react-router-dom";
import useGetAllPost from "@/hooks/useGetAllPost.jsx";
import useGetSuggestUsers from "@/hooks/useGetSuggestUsers.jsx";
import Loader from "./Loader.jsx";

const Home = () => {
  const [loading, setLoading] = useState(true);
  useGetAllPost();
  useGetSuggestUsers();

  useEffect(() => {
    // Simulate a delay for loading content, like fetching data
    setTimeout(() => {
      setLoading(false);
    }, 100); // Adjust the timeout as needed
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
