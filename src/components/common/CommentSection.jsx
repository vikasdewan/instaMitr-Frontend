import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setComments, addComment, clearComments } from "@/redux/commentSlice";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APP_BASE_URL } from "@/config.js";
 

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comment.comments);
  const {user} = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const navigate = useNavigate();
   const selectedPost = posts.find((post)=> post._id === postId);


   const GoToCommentUserProfile = (commentAuthorId) => {
  if (commentAuthorId !== user?._id) {
    window.location.href = `/profile/${commentAuthorId}`;
  }  
};

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
    <div className="flex flex-col h-full bg-[#0f0f0f] p-4 rounded-xl shadow-inner border border-[#1c1c1c]">

  {/* 🧑 Post Owner Header */}
  <div
    className="flex items-center gap-3 cursor-pointer mb-4 hover:bg-[#1c1c1c] p-2 rounded-lg transition duration-200"
    onClick={() => navigate(`/profile/${selectedPost?.author?._id}`)}
  >
    <img
      src={selectedPost?.author?.profileImage || "https://via.placeholder.com/40"}
      alt="User Avatar"
      className="w-10 h-10 rounded-full object-cover border border-gray-600"
    />
    <h4 className="text-white text-base md:text-lg font-semibold tracking-wide">
      {selectedPost?.author?.username || "User"}
    </h4>
  </div>

  <hr className="border-gray-700 mb-4" />

  {/* 💬 Comments Section */}
  <div className="flex-1 overflow-y-auto custom-scroll pr-1 space-y-3 min-h-0">
    {comments.length === 0 ? (
      <p className="text-gray-500 text-sm text-center">No comments yet. Be the first to comment!</p>
    ) : (
      comments.map((comment) => (
        <div
          key={comment._id}
          className="flex items-start gap-3 bg-[#1c1c1c] p-3 rounded-lg border border-[#2a2a2a] hover:shadow-md transition-all"
        >
          <img
           onClick={() => 
            GoToCommentUserProfile(comment?.author?._id)}
            src={comment.author?.profileImage || "https://via.placeholder.com/40"}
            alt="avatar"
            className="w-9 h-9 cursor-pointer rounded-full object-cover border border-gray-700"
          />
          <div className="flex flex-col">
            <span 
             onClick={() => GoToCommentUserProfile(comment?.author?._id)}
            className="text-white cursor-pointer font-medium text-sm mb-1">
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

  {/* ✍️ Input Box */}
  <div className="mt-5 pt-3 border-t border-gray-800 flex flex-col gap-3">
    <div className="flex gap-2 items-center">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
        placeholder="Add a comment..."
        className="flex-1 px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-[#333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        className="text-white bg-[#2a2a2a] p-2 rounded-lg hover:bg-[#3a3a3a] transition"
      >
        <Smile size={20} />
      </button>
      <button
        onClick={handlePostComment}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
      >
        Post
      </button>
    </div>

    {showEmojiPicker && (
      <div className="relative">
        <div className="absolute bottom-[4.5rem] right-2 z-50">
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
      </div>
    )}
  </div>
</div>


  );
};

export default CommentSection;
