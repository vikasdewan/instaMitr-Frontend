import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

function Post({ post }) {
  const [text, setText] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async (postId) => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${postId}/${action}`
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatePostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatePostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto text-white">
      <div className="flex items-center justify-between">
        <div className="flex item-center gap-2 ">
          <Avatar className="text-black">
            <AvatarImage src={post.author?.profileImage} alt="post_image" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
          <h1 className="mt-1">{post.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="bg-black text-white flex flex-col items-center text-sm text-center ">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold rounded-xl hover:bg-gray-500"
            >
              Unfollow
            </Button>

            <Button
              variant="ghost"
              className="cursor-pointer w-fit   rounded-xl hover:bg-gray-500"
            >
              Add to Favourites
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit  rounded-xl hover:bg-gray-500"
            >
              About this account
            </Button>
            {
              //show the delete button only to logged In user's post
              user && user?._id === post?.author._id && (
                <Button
                  variant="ghost"
                  className="cursor-pointer w-fit  rounded-xl font-bold hover:bg-gray-500"
                  onClick={deletePostHandler}
                >
                  Delete
                </Button>
              )
            }
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
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
      <span className="font-medium text-sm mb-2 block">
        {post.likes.length} likes
      </span>
      <p>
        <span className="font-medium text-sm ">{post.author.username}</span>{" "}
        &nbsp; {post.caption}
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
