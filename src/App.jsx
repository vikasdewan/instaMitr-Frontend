import "./App.css";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile.jsx";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import { EditProfile } from "./components/EditProfile";
import { ChatPage } from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
  

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/account/edit",
        element: <EditProfile/>,
      },
      {
        path: "/chat",
        element: <ChatPage/>,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  
  const {user} = useSelector((store) => store.auth);
  const  dispatch = useDispatch();
  const {socket} = useSelector(store => store.socketio);

  useEffect(()=>{
    if(user){
      const socketio = io('http://localhost:8000' , {
        query:{
          userId:user?._id
        },
        transports:['websocket'] //network me bohot sari api call ho rahi hoti hai toh usko reduce karne ke liye iska use kia
      });
      dispatch(setSocket(socketio))

      //listening all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))});

    return ()=>{
      socketio.close();
      dispatch(setSocket(null))
    }

  } else if(socket){
      socket?.close();
      dispatch(setSocket(null))
  }

  },[user,dispatch]);


  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
