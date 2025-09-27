import React, { useRef, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Textarea,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/index.js";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Eye, EyeOff, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import { APP_BASE_URL } from "@/config.js";

export const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // dialog state
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    profileImage: user?.profileImage,
    bio: user?.bio,
    username: user?.username,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profileImage: file });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("username", input.username);
    if (input.profileImage instanceof File) {
      formData.append("profileImage", input.profileImage);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${APP_BASE_URL}/api/v1/user/profile/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profileImage: res.data.user?.profileImage,
          username: res.data.user?.username,
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

  const changePasswordHandler = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setPwdLoading(true);
      const res = await axios.put(
        `${APP_BASE_URL}/api/v1/user/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      if (res.data.status) {
        toast.success(res.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOpenDialog(false);
      } else {
        toast.error(res.data.message || "Password change failed.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error changing password");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="text-white flex max-w-2xl px-3 mx-auto my-8">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-2xl">Edit Profile</h1>

        {/* Profile Section */}
        <div className="flex item-center justify-between bg-gray-900 p-4 rounded-xl">
          <div className="flex items-center justify-center gap-3">
            <Avatar className="text-black w-16 h-16">
              <AvatarImage src={user?.profileImage} alt="profile_image" />
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
            className="bg-black w-full text-white focus-visible:ring-0 focus:outline-none border-none"
          />
        </div>

        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            placeholder="Enter your bio"
            className="text-white bg-gray-900 focus-visible:ring-0 focus:outline-none border-none"
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

        {/* Change Password Option */}
        <div className="bg-gray-800 rounded-md p-3 flex justify-between items-center">
          <span className="text-lg font-medium">Want to change password ?</span>
          <Button
            className="bg-green-500 hover:bg-green-700"
            onClick={() => setOpenDialog(true)}
          >
            Change Password
          </Button>
        </div>

        {/* Password Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent
            className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-xl shadow-lg
               w-full max-w-md sm:max-w-md mx-4 sm:mx-auto"
          >
            {/* Close button */}
            <div className="text-end">
              <button
                onClick={() => setOpenDialog(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <DialogHeader className="mb-6 text-center">
              <DialogTitle className="text-2xl font-bold text-white">
                Change Password
              </DialogTitle>
              <p className="text-gray-300 text-sm mt-1">
                Enter your current password and choose a new one
              </p>
            </DialogHeader>

            {/* Form */}
            <form onSubmit={changePasswordHandler} className="space-y-6">
              {/* Current Password */}
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Current Password
                </h3>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-0 rounded-lg py-2 px-3 w-full placeholder-gray-400"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-400 hover:text-white"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <h3 className="text-white font-semibold mb-1">New Password</h3>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-0 rounded-lg py-2 px-3 w-full placeholder-gray-400"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-400 hover:text-white"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Confirm New Password
                </h3>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-0 rounded-lg py-2 px-3 w-full placeholder-gray-400"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-2">
                {pwdLoading ? (
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    Update Password
                  </Button>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
};
