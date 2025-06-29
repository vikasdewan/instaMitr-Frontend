import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { APP_BASE_URL } from "@/config.js";

function CreatePost({ open, setOpen }) {
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault(); // Ensure the form submission is prevented

    const formData = new FormData();
    formData.append("caption", caption);

    if (file) {
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        formData.append("image", file);

        try {
          setLoading(true);
          const res = await axios.post(
            `http://localhost:8000/api/v1/post/addpost/image`, // Image API endpoint
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );

          if (res.data.success) {
            dispatch(setPosts([res.data.post, ...posts]));
            toast.success(res.data.message);
            setOpen(false);
            // Clear inputs for next use
            setCaption("");
            setImagePreview("");
            setFile(null);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          setLoading(false);
        }
      }
      // Check if the file is a video
      else if (file.type.startsWith("video/")) {
        console.log("file Details:", file);
        formData.append("video", file);
        try {
          setLoading(true);
          const res = await axios.post(
            `http://localhost:8000/api/v1/post/addpost/video`, // Video API endpoint
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );
          console.log(res);

          if (res.data.success) {
            dispatch(setPosts([res.data.post, ...posts]));
            toast.success(res.data.message);
            setOpen(false);
            // Clear inputs for next use
            setCaption("");
            setFile(null);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("Only image or video files are allowed.");
        setLoading(false);
      }
    } else {
      toast.error("Please select a file.");
      setLoading(false);
    }
  };

  // Scroll to the top of the page when the dialog opens
  useEffect(() => {
    if (open) {
      window.scrollTo(0, 0); // Scrolls to the top of the page
    }
  }, [open]);

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
              <AvatarImage src={user?.profileImage} alt="user_Image" />
              <AvatarFallback className="text-white bg-pink-700">
                IM
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-xs">{user?.username}</h1>
              <span className="text-gray-600 text-xs">Bio Here...</span>
            </div>
          </div>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="focus-visible:ring-transparent border-none bg-black text-xs"
            placeholder="Write a caption..."
          ></Textarea>

          {imagePreview && file && (
            <div className="w-full h-64 flex items-center justify-center">
              {/* Display image preview */}
              {file.type.startsWith("image/") && (
                <img
                  src={imagePreview}
                  alt="preview_img"
                  className="object-cover h-full w-full rounded-lg"
                />
              )}
              {/* Display video preview */}
              {file.type.startsWith("video/") && (
                <video
                  controls
                  src={imagePreview}
                  className="object-cover h-full w-full rounded-lg"
                />
              )}
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
