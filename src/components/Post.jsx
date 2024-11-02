import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

function Post() {
  const [text, setText] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  return (
    <div className="my-8 w-full max-w-sm mx-auto text-white">
      <div className="flex items-center justify-between">
        <div className="flex item-center gap-2 ">
          <Avatar className="text-black">
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
          <h1 className="mt-1">username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold rounded-xl"
            >
              Unfollow
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit   rounded-xl"
            >
              Add to Favourites
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit  rounded-xl"
            >
              About this account
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit  rounded-xl font-bold"
            >
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src="https://images.unsplash.com/photo-1730465447702-caa810acd8e7?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="post_image"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3 ">
          <FaRegHeart
            size={"22px"}
            className="cursor-pointer hover:text-gray-400"
          />
          <MessageCircle
            onClick={() => setOpenComment(true)} //when we use callback function i.e. ()=> ...  there we can pass argument or params in the function further calling like setOpenCommnet(true)
            className="cursor-pointer hover:text-gray-400"
          />
          <Send className="cursor-pointer hover:text-gray-400" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-400" />
      </div>
      <span className="font-medium text-sm mb-2 block"> 100k likes</span>
      <p>
        <span className="font-medium text-sm ">username</span> &nbsp; caption
      </p>
      <span
        onClick={() => setOpenComment(true)}
        className="cursor-pointer font-thin text-sm text-gray-400"
      >
        View all 100 comments
      </span>
      <CommentDialog
        openComment={openComment}
        setOpenComment={setOpenComment}
      />
      <div className="flex">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full bg-black"
          value={text}
          onChange={changeEventHandler}
        />
        {text && (
          <span id="Postbutton" className="text-[#0095F6] text-sm font-bold">
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
