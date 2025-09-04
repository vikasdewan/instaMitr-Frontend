import React, { useEffect, useState } from "react";
import {Feed} from "../feed/index.js";
import {RightSideBar} from "../layout/index.js";
import { Outlet } from "react-router-dom";
import {useGetAllPost,useGetSuggestUsers} from "@/hooks/index.js";
 
import {Loader} from "../common/index.js";

const Home = () => {
  const [loading, setLoading] = useState(true);

  // ✅ Custom hooks must be called directly at the top level 

  useGetAllPost();        // These hooks should internally manage when to fetch (usually with useEffect inside)
  useGetSuggestUsers();

  useEffect(() => {
    // Simulate a delay to show loader
    const timer = setTimeout(() => {
      setLoading(false) ;
    }, 100);

    return () => clearTimeout(timer);
  }, [] );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div  className="text-white flex">
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
