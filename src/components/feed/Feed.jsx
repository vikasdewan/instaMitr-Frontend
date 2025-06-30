import React from "react";
import {
  Posts,
  StoriesCarousel
} from "../feed/index.js";

function Feed() {
  return (
    <>
      <div className="w-full ">
        <div className="md:pl-56  ">
          <StoriesCarousel />
        </div>
        <div className="flex-1 my-1 flex flex-col items-center md:pl-[30%]">
          <Posts />
        </div>
      </div>
    </>
  );
}

export default Feed;
