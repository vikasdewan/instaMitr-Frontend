import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setMessages, setSelectedUser } from "../redux/chatSlice.js";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Messages } from "./Messages";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const { onlineUsers, selectedUser, messages } = useSelector(
    (store) => store.chat
  );

  const dispatch = useDispatch();
  const location = useLocation();
  const [followedUsers, setFollowedUsers] = useState([]);


  // Filter out users that are already in the following list
  useEffect(() => {
    if (user?._id && suggestedUsers) {
      const filteredUsers = suggestedUsers.filter((suggUser) =>
        suggUser?.followers?.includes(user._id)
      );
      setFollowedUsers(filteredUsers); // Update followed users
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  //cleanup , means jab message tab se user hatega, aur jab phir aayega toh koi bhi user selected nahi hoga
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  useEffect(() => {
    if (location.state?.selectedUser) {
      dispatch(setSelectedUser(location.state.selectedUser));
    }
  }, [location.state, dispatch]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/v1/message/${selectedUser._id}`, // Fetch messages
            { withCredentials: true }
          );

          if (res.data.success) {
            dispatch(setMessages(res.data.messages));
             // Store messages in Redux
          }
        } catch (error) {
          console.error("Failed to load messages:", error);
        }
      }
    };

    fetchMessages();
  }, [selectedUser]);

  return (
    <div className="ml-48  text-white flex">
      <section className="w-full  md:w-1/4 my-8">
        <h1 className="font-bold mb-8 px-4 text-2xl">{user?.username}</h1>
        {/* <hr className="mb-4 border-gray-600 " /> */}
        <div className="overflow-y-auto h-[80vh]">
          {followedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className={`text-gray-200 ml-3 flex gap-3 items-center p-3 hover:bg-gray-900 cursor-pointer ${
                  selectedUser?._id === suggestedUser?._id
                    ? `font-bold`
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
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-600 flex flex-col h-screen">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0   z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profileImage} alt="profile" />
              <AvatarFallback>IM</AvatarFallback>
            </Avatar>
            <div className="flex flexx-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-600 ">
            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 bg-black text-white focus-visible:ring-transparent"
              placeholder="Messages..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && textMessage.trim() !== "") {
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
      ) : (
        <div className="flex text-gray-500 flex-col items-center justify-center mx-auto">
          <MessageCircleIcon className="w-32 h-32 my-4" />
          <h1 className="text-xl font-bold">Your Messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};
