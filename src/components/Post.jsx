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
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import "../index.css";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

function Post({ post }) {
  const [text, setText] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes?.length);
  const [comment, setComment] = useState(post?.comments);
  const [animate, setAnimate] = useState(false);


  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        setAnimate(true);
        setTimeout(() => {
          setAnimate(false);
        }, 300);

        const updatedPostData = posts.map((p) =>
          p?._id === post?._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user?._id],
              }
            : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p?._id === post?._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
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

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setBookmarked(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-8 w-full max-w-md mx-auto text-white px-2 md:px-0">
      <div className="flex items-center justify-between">
        <div className="flex item-center gap-2 ">
          <Link to={`/profile/${post?.author?._id}`}>
            <Avatar className="text-black">
              <AvatarImage src={post?.author?.profileImage} alt="post_image" />
              <AvatarFallback>IM</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post?.author?._id}`}>
              <h1 className="font-bold">{post?.author?.username}</h1>
            </Link>

            {post?.author?._id === user?._id ? (
              <Badge variant="secondary" className="font-bold bg-gray-300 text-black">
                My Vibe
              </Badge>
            ) : null}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="bg-black text-white flex flex-col items-center text-sm text-center ">
            {post.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold rounded-xl hover:bg-gray-500"
              >
                Unfollow
              </Button>
            )}

            <Button
              variant="ghost"
              className="cursor-pointer w-fit rounded-xl hover:bg-gray-500"
            >
              Add to Favourites
            </Button>
            <Link to={`/profile/${post?.author?._id}`}>
              <Button
                variant="ghost"
                className="cursor-pointer w-fit rounded-xl hover:bg-gray-500"
              >
                About this account
              </Button>
            </Link>

            {user && user?._id === post?.author?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit rounded-xl font-bold hover:bg-gray-500"
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post?.image}
        alt="post_image"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3 ">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className={`cursor-pointer text-red-600 hover:text-red-700 ${
                animate ? "pop-animation" : ""
              }`}
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className={`cursor-pointer hover:text-gray-400 ${
                animate ? "pop-animation" : ""
              }`}
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpenComment(true);
            }}
            className="cursor-pointer hover:text-gray-400"
          />
          <Send className="cursor-pointer hover:text-gray-400" />
        </div>
        <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-400" />
      </div>
      <span className="font-medium text-sm mb-2 block">{postLike} likes</span>
      <p>
        <span className="font-medium text-sm">{post?.author?.username}</span> &nbsp; {post?.caption}
      </p>
      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpenComment(true);
        }}
        className="cursor-pointer font-thin text-sm text-gray-400"
      >
        {comment?.length === 0 ? "" : `View all ${comment?.length} comments`}
      </span>
      <CommentDialog openComment={openComment} setOpenComment={setOpenComment} />
      <div className="flex">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full bg-black mt-3"
          value={text}
          onChange={changeEventHandler}
        />
        {text && (
          <span
            onClick={commentHandler}
            id="Postbutton"
            className="text-[#0095F6] text-sm font-bold mt-3 cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
