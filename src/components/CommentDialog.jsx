import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";

function CommentDialog({ openComment, setOpenComment }) {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [comment, setComment] = useState([]);

  // Load comments into local state on component mount
  useEffect(() => {
    if (selectedPost?.comments) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://instamitr-deploy-1.onrender.com/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const newComment = res.data.comment;

        // Update local comment state
        const updatedCommentData = [...comment, newComment];
        setComment(updatedCommentData);

        // Update the selectedPost and posts in Redux
        const updatedPostData = posts.map((p) =>
          p?._id === selectedPost?._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleKeyDown = (e)=>{
    if (e.key === "Enter" && text.trim()) { sendMessageHandler(); }
  }

        
  return (
    <Dialog open={openComment}>
      <DialogContent
        className="bg-black  text-white max-w-2xl p-0 flex flex-col"
        onInteractOutside={() => setOpenComment(false)}
      >
        <div className="flex px-2">
          <div className="hidden md:block w-1/2 min-h-96">
            <img
              src={selectedPost?.image}
              className="w-full h-full rounded-lg object-cover"
              alt="post_image"
            />
          </div>

          <div className=" w-full md:w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profileImage} />
                    <AvatarFallback className="bg-black text-white">
                      IM
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs hover:text-gray-400">
                    {selectedPost?.author?.username}
                  </Link>{" "}
                  &nbsp;
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="bg-black text-white flex flex-col items-center text-sm text-center">
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit text-[#ED4956] font-bold rounded-xl hover:bg-gray-500"
                  >
                    Unfollow
                  </Button>
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit rounded-xl hover:bg-gray-500"
                  >
                    Add to Favourites
                  </Button>
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit rounded-xl hover:bg-gray-500"
                  >
                    About this account
                  </Button>
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit rounded-xl font-bold hover:bg-gray-500"
                  >
                    Delete
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr />

            <div className="flex flex-col flex-grow max-h-[90%] justify-between">
              <div className="overflow-y-auto max-h-96 p-4">
                {comment?.map((c) => (
                  <Comment key={c?._id} comment={c} />
                ))}
              </div>
              <div className="p-4 flex">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment...."
                  className="placeholder-white text-white bg-black text-sm w-full outline-none border-gray-300 p-2 rounded"
                  onKeyDown={handleKeyDown}
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                  className="bg-black text-blue-500 border-none hover:bg-none hover:bg-black hover:text-blue-200 font-bold"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
