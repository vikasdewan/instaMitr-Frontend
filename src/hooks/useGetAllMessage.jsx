import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const {selectedUser} = useSelector(store => store.chat)
  const dispatch = useDispatch(); //basically kuch chij bhejne ka kaam karta hai
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllMessage();
  }, [selectedUser]);
};

export default useGetAllMessage;
