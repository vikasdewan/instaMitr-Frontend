import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setComments, addComment, clearComments } from "../redux/commentSlice";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comment.comments);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/post/${postId}/comment/all`,
          {
            withCredentials: true,
          }
        );
        dispatch(setComments(res.data.comments || []));
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };

    if (postId) fetchComments();
    return () => dispatch(clearComments()); // Clean on unmount
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
      console.error("Failed to post comment", err);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full">
      <h4 className="text-white text-lg font-bold mb-4">Comments</h4>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scroll min-h-0">
        {comments.length === 0 ? (
  <p className="text-gray-400 text-sm">No comments yet.</p>
) : (
  comments.map((comment) => (
    <div
      key={comment._id}
      className="flex items-start gap-3 bg-gray-800 bg-opacity-60 p-3 rounded-lg border border-gray-700 shadow-sm"
    >
      <img
        src={
          comment.author?.profileImage || "https://via.placeholder.com/40"
        }
        alt="avatar"
        className="w-9 h-9 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-white font-semibold text-sm">
          {comment.author?.username}
        </span>
        <span className="text-gray-300 text-sm break-words">
          {comment.text}
        </span>
      </div>
    </div>
  ))
)}

      </div>

      {/* Input Box */}
      <div className="mt-4 border-t border-gray-700 pt-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-white bg-gray-700 px-3 rounded-lg hover:bg-gray-600"
          >
            <FaSmile size={20} />
          </button>
          <button
            onClick={handlePostComment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Post
          </button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-[19%] right-40 z-50">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="dark"
              width={300}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
