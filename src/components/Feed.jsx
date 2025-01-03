import React from "react";
import Posts from "./Posts.jsx";
import Story from "./Story.jsx";

function Feed() {
  const story = [1, 2, 3, 4, 5, 6, 7];
  return (
    <>
     <div className="">
      <div className="md:ml-64">
        <div className="flex max-w-4xl justify-center gap-3 mt-3 mx-auto md:pl-10">
          {story.map((s) => (
            <Story key={s} />
          ))}
        </div>
      </div>
      <div className="flex-1 my-1 flex flex-col items-center md:pl-[30%]">
        <Posts />
      </div>
    </div>
    </>
  );
}

export default Feed;
