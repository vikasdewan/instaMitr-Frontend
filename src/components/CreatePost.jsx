import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function CreatePost({ open, setOpen }) {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setloading] = useState(false);

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }

    reader.onload = (e) => {
      const url = event.target.result;
      console.log(url);
    };
  };
  const createPostHandler = async (e) => {
    e.preventDefault();
    console.log(file, caption);
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
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="focus-visible:ring-transparent border-none bg-black text-xs"
            placeholder="Write a caption..."
          ></Textarea>

          {imagePreview && (
            <div className="w-full h-64 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="preview_img"
                className="object-cover h-full w-full rounded-lg"
              />
            </div>
          )}

          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileChangeHandler}
          />
          <Button
            onClick={() => imageRef.current.click()}
            className="font-bold rounded-full  w-fit mx-auto bg-[#0095f6] hover:bg-[#1470ae]"
          >
            Select from Computer
          </Button>
          {imagePreview &&
            (loading ? (
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
              </Button>
            ) : (
              <Button
                onClick={createPostHandler}
                type="submit"
                className="w-full"
              >
                Post
              </Button>
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreatePost;
