import { setSuggestedUsers } from "@/redux/authSlice";
 
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { APP_BASE_URL } from "@/config.js";

const useGetSuggestUsers = () => {
  const dispatch = useDispatch(); //basically kuch chij bhejne ka kaam karta hai
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/user/suggested`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSuggestedUsers();
  }, []);
};

export default useGetSuggestUsers;
