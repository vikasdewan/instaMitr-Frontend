import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setComments, addComment, clearComments } from "@/redux/commentSlice";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comment.comments);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const navigate = useNavigate();
  const selectedPost = posts.find((post) => post._id === postId);

  const GoToCommentUserProfile = (id) => {
    if (id !== user?._id) {
      window.location.href = `/profile/${id}`;
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/post/${postId}/comment/all`,
          { withCredentials: true }
        );
        dispatch(setComments(res.data.comments || []));
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };

    if (postId) fetchComments();
    return () => dispatch(clearComments());
  }, [postId, dispatch]);

  const handlePostComment = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${postId}/comment`,
        { text: input },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(addComment(res.data.comment));
        setInput("");
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error("Post comment failed", err);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full bg-black p-4 rounded-lg border border-[#262626]">
      {/* Author */}
      <div
        className="flex items-center gap-3 mb-4 cursor-pointer"
        onClick={() => navigate(`/profile/${selectedPost?.author?._id}`)}
      >
        <img
          src={selectedPost?.author?.profileImage}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-600"
        />
        <span className="text-white font-semibold text-sm hover:underline">
          {selectedPost?.author?.username}
        </span>
      </div>

      {/* Comments */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scroll">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex items-start gap-3 group">
              <img
                src={comment.author?.profileImage}
                alt="user"
                onClick={() => GoToCommentUserProfile(comment.author?._id)}
                className="w-8 h-8 rounded-full object-cover border border-gray-700 cursor-pointer"
              />
              <div className="flex flex-col text-sm">
                <span className="text-white font-semibold cursor-pointer hover:underline"
                  onClick={() => GoToCommentUserProfile(comment.author?._id)}>
                  {comment.author?.username}
                </span>
                <span className="text-gray-300 mt-[2px]">
                  {comment.text}
                </span>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span>6w</span>
                  <span>5 likes</span>
                  <span className="cursor-pointer hover:underline">Reply</span>
                </div>
              </div>
              {/* Like icon */}
              <div className="ml-auto text-gray-400 hover:text-pink-500 cursor-pointer">
                <i className="far fa-heart"></i>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Icons (Bottom Bar) */}
      {/* <div className="flex items-center justify-around text-white text-xl mt-4 mb-2 px-4">
        <i className="far fa-heart hover:text-pink-500 cursor-pointer"></i>
        <i className="far fa-comment hover:text-blue-500 cursor-pointer"></i>
        <i className="far fa-paper-plane hover:text-yellow-400 cursor-pointer"></i>
      </div> */}

      {/* Input */}
      <div className="border-t border-[#262626] pt-3 mt-3">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 bg-[#121212] text-white text-sm rounded-full border border-[#333] placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-gray-400 hover:text-white"
          >
            <Smile size={18} />
          </button>
          <button
            onClick={handlePostComment}
            className="text-blue-500 font-semibold text-sm"
          >
            Post
          </button>
        </div>
        {showEmojiPicker && (
          <div className="relative z-50">
            <div className="absolute bottom-[4.5rem] right-2">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="dark"
                height={350}
                width={300}
                searchDisabled
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
