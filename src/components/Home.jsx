import React from "react";
import Feed from "./Feed.jsx";
import RightSideBar from "./RightSideBar.jsx";
import { Outlet } from "react-router-dom";
import useGetAllPost from "@/hooks/useGetAllPost.jsx";
import useGetSuggestUsers from "@/hooks/useGetSuggestUsers.jsx";

const Home = () => {
  useGetAllPost()
  useGetSuggestUsers();
  return (
    <div className="text-white flex">
      <div className="flex-grow bg-black text-white">
        <Feed />
        <Outlet />
      </div>
      <RightSideBar />
    </div>
  );
}

export default Home;
