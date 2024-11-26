import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRealTimeMsg = () => {
  const {messages} = useSelector(store => store.chat);
  const dispatch = useDispatch(); //basically kuch chij bhejne ka kaam karta hai
  const {socket} = useSelector(store=> store.socketio)
  useEffect(() => {
    socket?.on('newMessage',(newMessage)=>{
        dispatch(setMessages([...messages, newMessage]))
          
    })

    //clean
    return ()=>{
        socket?.off('newMessage')
    }
  }, [messages, setMessages]);
};

export default useGetRealTimeMsg;
