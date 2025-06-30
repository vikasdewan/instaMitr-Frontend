import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage,Button, Textarea,Input} from "../ui/index.js";
import { useDispatch, useSelector } from "react-redux";
 
 
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
 
import { APP_BASE_URL } from "@/config.js";

export const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    profileImage: user?.profileImage,
    bio: user?.bio,
    username: user?.username, // Added username to state
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle file input change
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profileImage: file });
  };

  // Handle profile update
  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("username", input.username); // Append updated username
    if (input.profileImage instanceof File) {
      formData.append("profileImage", input.profileImage); // Only append file if it's updated
    }

    try {
      setLoading(true);

      // Debugging the formData content
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const res = await axios.post(
        `http://localhost:8000/api/v1/user/profile/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profileImage: res.data.user?.profileImage,
          username: res.data.user?.username, // Update username in state
        };

        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Update failed.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white flex max-w-2xl px-3 mx-auto my-8">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-2xl">Edit Profile</h1>
        <div className="flex item-center justify-between bg-gray-900 p-4 rounded-xl">
          <div className="flex items-center justify-center gap-3">
            <Avatar className="text-black w-16 h-16">
              <AvatarImage
                src={user?.profileImage}
                alt="profile_image"
                loading="lazy"
              />
              <AvatarFallback>IM</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-400 text-sm">
                {user?.bio || "Bio Here...."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
            accept="image/*"
          />
          <Button
            onClick={() => imageRef?.current?.click()}
            className="bg-blue-700 mt-2 hover:bg-blue-800"
          >
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Username</h1>
          <Input
            value={input.username}
            onChange={(e) => setInput({ ...input, username: e.target.value })}
            placeholder="Enter your username"
            name="username"
            className="bg-black w-full text-white focus-visible:ring-0 focus:outline-none border-none"
            autoComplete="new-username" // Prevent browser autofill for testing
          />
        </div>

        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            placeholder="Enter your bio"
            name="bio"
            className="  text-white bg-gray-900 focus-visible:ring-0 focus:outline-none border-none"
          />
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit bg-blue-600 hover:bg-blue-800">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-fit bg-blue-600 hover:bg-blue-800"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};
