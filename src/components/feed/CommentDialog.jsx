import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger,Avatar, AvatarFallback, AvatarImage ,Button } from "../ui/index.js";
 
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
 
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment.jsx";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";
import {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
} from "@/redux/authSlice";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { APP_BASE_URL } from "@/config.js";

function CommentDialog({ openComment, setOpenComment }) {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [comment, setComment] = useState([]);
  const [isFollowing, setIsFollowing] = useState(
    user?.following?.includes(selectedPost?.author?._id)
  );

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

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
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && text.trim()) {
      sendMessageHandler();
    }
  };

  const handleUnfollow = async () => {
    try {
      // console.log("follow/unfollow button clicked")
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${selectedPost?.author?._id}`,
        {}, // No body data required
        {
          withCredentials: true, // Send cookies with the request
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token if needed
          },
        }
      );

      if (response.data.success) {
        //for updating loggedin user
        const updatedFollowing = isFollowing
          ? user?.following?.filter((id) => id !== selectedPost?.author?._id)
          : [...user.following, selectedPost?.author?._id];

        dispatch(setAuthUser({ ...user, following: updatedFollowing }));

        //for updating profile user
        const updatedFollowers = isFollowing
          ? selectedPost?.author?.followers?.filter((id) => id !== user?._id) // Remove follower
          : [...selectedPost?.author?.followers, user?._id]; // Add follower

        dispatch(
          setUserProfile({
            ...selectedPost?.author,
            followers: updatedFollowers,
          })
        );

        //for updating the suggested users list
        const updatedSuggestedUsers = suggestedUsers?.map((suggUser) =>
          suggUser?._id === selectedPost?.author?._id
            ? {
                ...suggUser,
                followers: suggUser?.followers?.includes(user?._id)
                  ? suggUser?.followers?.filter((id) => id !== user?._id) // Unfollow
                  : [...suggUser?.followers, user?._id], // Follow
              }
            : suggUser
        );
        dispatch(setSuggestedUsers(updatedSuggestedUsers)); // upto date with the suggested Users

        setIsFollowing((prev) => !prev); // Toggle following state
        toast.success(response.data.message); // Success toast
      }
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
      toast.error("Something went wrong!"); // Optional: Error toast
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
          (postItem) => postItem?._id !== selectedPost?._id
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
    <Dialog open={openComment}>
      <DialogContent
        className="bg-black  text-white max-w-2xl p-0 flex flex-col"
        onInteractOutside={() => setOpenComment(false)}
      >
        <div className="flex px-2 justify-center">
          <div className="hidden md:block w-1/2 min-h-96">
            {selectedPost?.video ? (
              <video
                className="rounded-sm h-full  p-2 w-full aspect-square object-cover"
                autoPlay
                loop
                src={selectedPost?.video}
                alt="post_video"
              />
            ) : (
              <img
                className="rounded-sm h-full pb-5 my-2 w-full aspect-square object-cover"
                src={selectedPost?.image}
                alt="post_image"
              />
            )}
          </div>

          <div className=" w-full md:w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link to={`/profile/${selectedPost?.author?._id}`}>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profileImage} />
                    <AvatarFallback className="bg-black text-white">
                      IM
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    to={`/profile/${selectedPost?.author?._id}`}
                    className="font-semibold text-xs hover:text-gray-400"
                  >
                    {selectedPost?.author?.username}
                  </Link>{" "}
                  &nbsp;
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="bg-black text-white flex flex-col items-center text-sm text-center ">
                  {selectedPost?.author?._id !== user?._id && isFollowing ? (
                    <Button
                      variant="ghost"
                      className="cursor-pointer w-fit text-[#ED4956] font-bold rounded-xl hover:bg-gray-500"
                      onClick={handleUnfollow}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    ""
                  )}

                  <Link to={`/profile/${selectedPost?.author?._id}`}>
                    <Button
                      variant="ghost"
                      className="cursor-pointer w-fit rounded-xl hover:bg-gray-500"
                    >
                      About this account
                    </Button>
                  </Link>

                  {user && user?._id === selectedPost?.author?._id && (
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
            <hr />

            <div className="flex flex-col flex-grow max-h-[90%] justify-between">
              <div className="overflow-y-auto max-h-96 p-4">
                {comment?.map((c) => (
                  <Comment key={c?._id} comment={c} />
                ))}
              </div>
              <div className="p-4 flex items-center relative">
                <button
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="text-gray-200 border-black mr-2"
                >
                  <Smile size={22} />
                </button>

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
                  className="bg-black text-blue-500 border-none hover:bg-none hover:bg-black hover:text-blue-200 font-bold ml-2"
                >
                  Send
                </Button>

                {showEmojiPicker && (
                  <div className="absolute bottom-[60px] left-2 z-50">
                    <EmojiPicker
                    height={350}
                      width={300}
                    searchDisabled
                      skinTonesDisabled
                      previewConfig={{ showPreview: false }}
                    onEmojiClick={handleEmojiClick} theme="dark" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
