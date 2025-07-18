import { setUserProfile } from "@/redux/authSlice";
 
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { APP_BASE_URL } from "@/config.js";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch(); //basically kuch chij bhejne ka kaam karta hai
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
