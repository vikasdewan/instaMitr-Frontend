import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Textarea,
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/index.js";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { APP_BASE_URL } from "@/config.js";

function CreatePost({ open, setOpen }) {
  const imageRef = useRef();
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const fileChangeHandler = async (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    setFiles(selectedFiles);
    setFile(selectedFiles[0]);
    const previews = await Promise.all(
      selectedFiles.map(async (file) => await readFileAsDataURL(file))
    );
    setImagePreviews(previews);
  };

  const createPostHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption", caption);

    if (file) {
      if (file.type.startsWith("image/")) {
        files.forEach((f) => {
          formData.append("images", f);
        });

        try {
          setLoading(true);
          const res = await axios.post(
            `${APP_BASE_URL}/api/v1/post/addpost/image`,
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
            setCaption("");
            setImagePreviews([]);
            setFiles([]);
            setFile(null);
          }
        } catch (error) {
          toast.error(error.response?.data?.message);
        } finally {
          setLoading(false);
        }
      } else if (file.type.startsWith("video/")) {
        formData.append("video", file);
        try {
          setLoading(true);
          const res = await axios.post(
            `${APP_BASE_URL}/api/v1/post/addpost/video`,
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
            setCaption("");
            setFiles([]);
            setFile(null);
          }
        } catch (error) {
          toast.error(error.response?.data?.message);
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

  useEffect(() => {
    if (open) {
      window.scrollTo(0, 0);
    }
  }, [open]);

  return (
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

        {imagePreviews.length > 0 && file && file.type.startsWith("image/") && (
  <div className="w-full aspect-[4/3] max-h-72 overflow-hidden rounded-lg">
    <Carousel className="w-full h-full">
      <CarouselContent className="h-full">
        {imagePreviews.map((preview, index) => (
          <CarouselItem
            key={index}
            className="flex justify-center items-center h-full"
          >
            <img
              src={preview}
              alt={`preview_${index}`}
              className="object-contain h-full w-full rounded-lg"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  </div>
)}


        {imagePreviews.length === 1 && file && file.type.startsWith("video/") && (
          <div className="w-full h-64 flex items-center justify-center">
            <video
              controls
              src={imagePreviews[0]}
              className="object-cover h-full w-full rounded-lg"
            />
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
          accept="image/*,video/*"
          multiple
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="font-bold rounded-full  w-fit mx-auto bg-[#0095f6] hover:bg-[#1470ae]"
        >
          Select up to 3 Images or 1 Video
        </Button>
        {imagePreviews.length > 0 &&
          (loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </Button>
          ) : (
            <Button onClick={createPostHandler} type="submit" className="w-full">
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
