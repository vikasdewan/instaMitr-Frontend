import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage,Button,Input, } from "../ui/index.js";
 
 
import { X } from "lucide-react";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_BASE_URL } from "@/config.js";

const ReelComments = ({ reel, onClose, user }) => {
  const [comments, setComments] = useState(reel?.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const panelRef = useRef();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    setComments(reel?.comments || []);
    setNewComment("");
  }, [reel]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${reel?._id}/comment`,
        { text: newComment },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [res.data.comment, ...comments];
        setComments(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p?._id === reel?._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", {
        error: error.response ? error.response.data : error.message,
        status: error.response?.status,
      });
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewComment((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-transparent bg-opacity-50">
      <div
        ref={panelRef}
        className="h-1/2 w-full max-w-full md:max-w-md bottom-10 md:bottom-0 bg-gray-900 flex flex-col border-l border-gray-800
          md:rounded-none md:max-h-full
          fixed md:relative
          md:h-full
          sm:h-1/2 sm:rounded-t-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-white text-xl font-bold">
            Comments ({comments.length})
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3">
                <Link to={`/profile/${comment?.author?._id}`} >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author?.profileImage} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <Link  to={`/profile/${comment?.author?._id}`} >
                    <p className="font-semibold text-white">
                      {comment.author?.username}
                    </p>
                    </Link>
                    <p className="text-white">{comment.text}</p>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input box with emoji */}
        <div className="p-4 border-t border-gray-800">
          <div className="relative">
            <div className="flex space-x-2 items-center">
              <Input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 text-white border-none"
                onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
              />
              <Button
                variant="ghost"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-white  hover:bg-gray-500"
              >
                <Smile size={20} />
              </Button>
              <Button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Post
              </Button>
            </div>

            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 z-50">
                <EmojiPicker
                  searchDisabled
                      skinTonesDisabled
                      previewConfig={{ showPreview: false }}
                  onEmojiClick={handleEmojiClick}
                  theme="dark"
                  height={350}
                  width={300}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelComments;
