import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {setSelectedUser} from '../redux/chatSlice.js'
import { MessageCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Messages } from "./Messages";

export const ChatPage = () => {
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const {selectedUser} = useSelector((store)=> store.chat)
  const isOnline = false;
  const dispatch = useDispatch()

  return (
    <div className="ml-48  text-white flex">
      <section className="w-full  md:w-1/4 my-8">
        <h1 className="font-bold mb-8 px-4 text-2xl">{user?.username}</h1>
        {/* <hr className="mb-4 border-gray-600 " /> */}
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            return (
              <div onClick={()=> dispatch(setSelectedUser(suggestedUser))} className={`text-gray-200 ml-3 flex gap-3 items-center p-3 hover:bg-gray-900 cursor-pointer ${selectedUser?._id === suggestedUser?._id ? `font-bold` : 'font-medium'}`}>
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={suggestedUser?.profileImage}
                    alt="profile_image"
                  />
                  <AvatarFallback>IM</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span >
                        {suggestedUser?.username}
                    </span>
                    <span className={`text-xs font-bold ${isOnline ? 'text-green-500' : 'text-red-600'}`}>{isOnline ? "online" : "offline"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {
        selectedUser ? 
        
        (
            <section className="flex-1 border-l border-l-gray-600 flex flex-col h-screen">
                <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0   z-10">
                    <Avatar>
                        <AvatarImage src={selectedUser?.profileImage} alt='profile'/>
                        <AvatarFallback>IM</AvatarFallback>
                    </Avatar>
                    <div className="flex flexx-col">
                        <span>{selectedUser?.username}</span>
                    </div>
                </div>
               <Messages selectedUser = {selectedUser}/>
                <div className="flex items-center p-4 border-t border-t-gray-600 ">
                    <input type="text" className="flex-1 mr-2 bg-black text-white focus-visible:ring-transparent" placeholder="Messages..." />
                    <Button>Send</Button>
                </div>
            </section>
        ) 
        
        : 

        (
            <div className="flex text-gray-500 flex-col items-center justify-center mx-auto">
                <MessageCircleIcon className="w-32 h-32 my-4"/>
                <h1 className="text-xl font-bold">Your Messages</h1>
                <span>Send a message to start a chat.</span>
            </div>
        )
      }
    </div>
  );
};
