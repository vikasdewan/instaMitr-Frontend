import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/index.js";
import { useSelector } from "react-redux";

function Comment({ comment }) {
  const { user } = useSelector((store) => store.auth);
  const GoToCommentUserProfile = (commentAuthorId) => {
    if (commentAuthorId !== user._id) {
      window.location.href = `/profile/${commentAuthorId}`;
    }
  };

  return (
    <div className="my-2 md:px-4 sm:px-2">
      <div className="flex py-2 gap-3 items-start">
        <Avatar
          onClick={() => GoToCommentUserProfile(comment?.author?._id)}
          className="w-8 h-8 md:w-12 md:h-12 sm:w-8 sm:h-8 cursor-pointer"
        >
          <AvatarImage src={comment?.author?.profileImage} />
          <AvatarFallback>IM</AvatarFallback>
        </Avatar>
        <div className="flex sm:flex-col">
          <h1 
           onClick={() => GoToCommentUserProfile(comment?.author?._id)}
          className="font-bold cursor-pointer h-6 text-sm sm:text-sm">
            {comment?.author?.username} &nbsp; &nbsp;{" "}
          </h1>
          <span className="ml-3 font-normal text-sm sm:text-sm">
            {comment?.text}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Comment;
