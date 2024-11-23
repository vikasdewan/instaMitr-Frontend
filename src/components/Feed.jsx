import React from "react";
import Posts from "./Posts.jsx";
import Story from "./Story.jsx";

function Feed() {
  const story = [1,2,3,4,5,6,7,8];
  return (
    <>
    <div className=" ml-64 ">
       <div className= " flex gap-3 text-black  pl-[17%] pt-3">
      {story.map((s) => (
        <Story/>
      ))}
    </div>
    </div>
      <div className="flex-1 my-1 flex flex-col items-center pl-[30%] ">
        <Posts />
      </div>
    </>
  );
}

export default Feed;
