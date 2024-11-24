import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export const EditProfile = () => {
   const imageRef = useRef(); 
    const {user} = useSelector((store) =>store.auth)
  return (
    <div className="text-white flex max-w-2xl mx-auto my-4">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex item-center justify-between bg-gray-900 p-4 rounded-xl  ">
         
          <div className="flex items-center justify-center gap-3">
            <Avatar className="text-black w-16 h-16">
              <AvatarImage src={user?.profileImage} alt="post_image" />
              <AvatarFallback>IM</AvatarFallback> 
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-400 text-sm ">
                {user?.bio || "Bio Here...."}
              </span>
            </div>
          </div>
          <input ref={imageRef} type="file" className="hidden"/>
          <Button onClick={() =>imageRef?.current?.click()} className={`bg-blue-700 mt-2 hover:bg-blue-800`} >Change Photo</Button> 
        </div>
        <div>
            <h1 className="font-bold text-xl">Bio</h1>
            <Textarea name='bio' className={`bg-black text-white bg-gray-900 focus-visible:ring-transparent`}/>
        </div>
      </section>
    </div>
  );
};
