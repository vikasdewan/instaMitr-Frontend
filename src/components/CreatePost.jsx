import React from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

function CreatePost({ open, setOpen }) {
  const imageRef = useRef
  const createPostHandler = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="bg-black text-white"
        >
          <DialogHeader className="flex items-center font-bold text-lg">
            Create New Post
          </DialogHeader>
          <div className="flex gap-3 items-center ">
            <Avatar>
              <AvatarImage src="" alt="user_Image" />
              <AvatarFallback className="text-white bg-pink-700">
                IM
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-xs">Username</h1>
              <span className="text-gray-600 text-xs">Bio Here...</span>
            </div>
          </div>
          <Textarea className="focus-visible:ring-transparent border-none bg-black text-xs" placeholder="Write a caption...">
          </Textarea>
          <input type="file" className="hidden"/>
          <Button className="font-bold rounded-full  w-fit mx-auto bg-[#0095f6] hover:bg-[#1470ae]">Select from Computer</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreatePost;
