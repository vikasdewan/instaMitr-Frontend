import React, { useEffect, useRef, useState } from "react";
import {
  Avatar, AvatarFallback, AvatarImage,Button 
} from "../ui/index";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {useGetAllMessage,useGetRealTimeMsg} from "@/hooks/index.js";
 
import { updateMessageReaction } from "@/redux/chatSlice";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { APP_BASE_URL } from "@/config.js";

 const Messages = () => {
  useGetRealTimeMsg();
  useGetAllMessage();

  const { socket } = useSelector((store) => store.socketio);
  const { user } = useSelector((store) => store.auth);
  const { messages, selectedUser } = useSelector((store) => store.chat);

  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [openEmojiPickerMsgId, setOpenEmojiPickerMsgId] = useState(null);

  const prevMsgCountRef = useRef(messages?.length || 0);

  useEffect(() => {
    const newMsgCount = messages?.length || 0;
    const prevMsgCount = prevMsgCountRef.current;

    // Only scroll when new messages are added
    if (newMsgCount > prevMsgCount) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevMsgCountRef.current = newMsgCount;
  }, [messages]);

  const handleReact = async (messageId, emoji) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/message/react/${messageId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emoji }),
        }
      );

      const text = await res.text();
      if (!text) throw new Error("Empty response from server");

      const data = JSON.parse(text);
      if (!data.success) {
        console.log("Reaction failed:", data.message);
        return;
      }
    } catch (error) {
      console.log("Reaction failed:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handler = (updatedMessage) => {
      dispatch(updateMessageReaction(updatedMessage));
    };
    socket.on("messageReaction", handler);
    return () => socket.off("messageReaction", handler);
  }, [dispatch, socket]);

  const groupReactions = (reactions) => {
    if (!reactions || reactions.length === 0) return [];
    const grouped = reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([emoji, count]) => ({ emoji, count }));
  };

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="w-28 h-28">
            <AvatarImage src={selectedUser?.profileImage} alt="profile_Image" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
          <span className="font-bold text-2xl">{selectedUser?.username}</span>
          <span className="text-gray-500 text-xs">
            {selectedUser?.username} · Instagram
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 p-3 bg-gray-800 my-2">View Profile</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {messages?.map((msg) => {
          const groupedReactions = groupReactions(msg.reactions);
          const isSender = msg.senderId === user._id;

          return (
            <div
              key={msg._id}
              className={`flex flex-col ${
                isSender ? "items-end" : "items-start"
              }`}
              onMouseEnter={() => setHoveredMsgId(msg._id)}
              onMouseLeave={() => setHoveredMsgId(null)}
            >
              <div className="relative flex  ">
                {isSender && hoveredMsgId === msg._id && (
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // stops default button behavior
                      e.stopPropagation(); // prevents bubbling
                      document.activeElement?.blur(); // removes any focus
                      setOpenEmojiPickerMsgId(
                        openEmojiPickerMsgId === msg._id ? null : msg._id
                      );
                    }}
                    type="button"
                    className="text-white opacity-80 hover:opacity-100 mr-2"
                  >
                    <Smile size={18} />
                  </button>
                )}

                <div
                  className={`p-2 rounded-lg max-w-xs break-words  ${
                    isSender
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {msg.message}
                </div>

                {!isSender && hoveredMsgId === msg._id && (
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // stops default button behavior
                      e.stopPropagation(); // prevents bubbling
                      document.activeElement?.blur(); // removes any focus
                      setOpenEmojiPickerMsgId(
                        openEmojiPickerMsgId === msg._id ? null : msg._id
                      );
                    }}
                    type="button"
                    className="text-white opacity-80 hover:opacity-100 ml-2"
                  >
                    <Smile size={18} />
                  </button>
                )}

                {/* Emoji Picker */}
                {openEmojiPickerMsgId === msg._id && (
                  <div
                    className={`absolute z-50 -top-40 ${
                      isSender ? "right-12 md:right-40" : "md:left-40 left-12 "
                    }`}
                  >
                    <EmojiPicker
                      theme="dark"
                      height={300}
                      width={300}
                      searchDisabled
                      skinTonesDisabled
                      previewConfig={{ showPreview: false }}
                      onEmojiClick={(e) => {
                        handleReact(msg._id, e.emoji);
                        setOpenEmojiPickerMsgId(null);
                        document.activeElement?.blur(); // 👈 blur after selection
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Reactions Display */}
              {groupedReactions.length > 0 && (
                <div className="relative -mt-2 z-10">
                  <div className="flex gap-2 bg-gray-800  px-[4px] py-[1px] rounded-full text-black shadow-md border border-gray-700 w-fit  ">
                    {groupedReactions.map(({ emoji, count }) => (
                      <span
                        key={emoji}
                        className="flex items-center text-white text-base select-none"
                        title={`${count} reaction${count > 1 ? "s" : ""}`}
                      >
                        {emoji} {count > 1 ? count : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};


export default Messages;