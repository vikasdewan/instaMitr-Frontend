import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar, AvatarFallback, AvatarImage,Button 
} from "../ui/index.js";
 
import { setMessages, setSelectedUser } from "@/redux/index.js";
import { MessageCircleIcon, ArrowLeft, Smile } from "lucide-react";
 
import { Messages } from "./index.js";
import axios from "axios";
import { useLocation } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { APP_BASE_URL } from "@/config.js";

export const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const { onlineUsers, selectedUser, messages } = useSelector(
    (store) => store.chat
  );

  const [showChatList, setShowChatList] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    if (user?._id && suggestedUsers) {
      const filteredUsers = suggestedUsers.filter((suggUser) =>
        suggUser?.followers?.includes(user?._id)
      );
      setFollowedUsers(filteredUsers);
    }
  }, [user, suggestedUsers]);

  const sendMessageHandler = async (recieverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${recieverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
        setShowEmojiPicker(false); // Optional: close picker after sending
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.selectedUser) {
      dispatch(setSelectedUser(location.state.selectedUser));
      setShowChatList(false);
    }
  }, [location.state, dispatch]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,
            { withCredentials: true }
          );

          if (res.data.success) {
            dispatch(setMessages(res.data.messages));
          }
        } catch (error) {
          console.error("Failed to load messages:", error);
        }
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);

  return (
    <div className="text-white flex flex-col md:flex-row md:ml-48 h-screen">
      <section
        className={`w-full border-b md:w-1/4 my-8 md:my-0 md:mx-8 ${
          showChatList ? "block" : "hidden"
        } md:block`}
      >
        <h1 className="font-bold mb-8 py-2 px-4 text-2xl border-b">
          {user?.username}
        </h1>
        <div className="overflow-y-auto h-[40vh] md:h-[80vh]">
          {followedUsers
            .sort((a, b) => {
              const isAOnline = onlineUsers.includes(a?._id);
              const isBOnline = onlineUsers.includes(b?._id);
              return isBOnline - isAOnline;
            })
            .map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div
                  key={suggestedUser?._id}
                  onClick={() => {
                    dispatch(setSelectedUser(suggestedUser));
                    setShowChatList(false);
                  }}
                  className={`text-gray-200 mx-3 flex gap-3 items-center p-3 hover:bg-gray-900 cursor-pointer ${
                    selectedUser?._id === suggestedUser?._id
                      ? "font-bold"
                      : "font-medium"
                  }`}
                >
                  <Avatar className="w-14 h-14">
                    <AvatarImage
                      src={suggestedUser?.profileImage}
                      alt="profile_image"
                    />
                    <AvatarFallback>IM</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{suggestedUser?.username}</span>
                    <span
                      className={`text-xs font-bold ${
                        isOnline ? "text-green-500" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "online" : "offline"}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {selectedUser && (
        <section
          className={`flex-1 border-l border-l-gray-600 flex flex-col h-screen ${
            showChatList ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-300 sticky top-0 z-10">
            {!showChatList && (
              <button
                onClick={() => {
                  setShowChatList(true);
                  dispatch(setSelectedUser(null));
                }}
                className="md:hidden p-2 bg-gray-800 rounded-full"
              >
                <ArrowLeft className="text-white" />
              </button>
            )}
            <Avatar>
              <AvatarImage src={selectedUser?.profileImage} alt="profile" />
              <AvatarFallback>IM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>

          <Messages selectedUser={selectedUser} />

          <div className="flex items-center mb-16 md:mb-0 p-4 border-t border-t-gray-600 relative">
            {/* emoji button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-white mr-2"
              type="button"
            >
              <Smile className="w-5 h-5" />
            </button>
          
            {showEmojiPicker && (
              <div className="absolute bottom-16 z-50">
                <EmojiPicker
                 
                  searchDisabled
                      skinTonesDisabled
                      previewConfig={{ showPreview: false }}
                  onEmojiClick={(emojiData) => {
                    setTextMessage((prev) => prev + emojiData.emoji);
                    setShowEmojiPicker(false);
                  }}
                  theme="dark"
                  height={350}
                  width={300}
                />
              </div>
            )}

            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 bg-black text-white focus-visible:ring-transparent"
              placeholder="Messages..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && textMessage.trim() !== "") {
                  e.preventDefault();
                  sendMessageHandler(selectedUser?._id);
                }
              }}
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      )}

      {!selectedUser && (
        <div className="flex text-gray-500 flex-col items-center justify-center mx-auto">
          <MessageCircleIcon className="w-32 h-32 my-4" />
          <h1 className="text-xl font-bold">Your Messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};
