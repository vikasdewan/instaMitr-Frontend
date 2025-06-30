import "./App.css";
import {
  Login,
  Signup,
  Home,
  Profile,
  MainLayout,
  EditProfile,
  ChatPage,
  ProtectedRoutes,
  SearchTab,
  SuggestedUsersPage,
  Reels,
  Explore,
} from "./components/index.js";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSocket,
  setOnlineUsers,
  setlikeNotiList
} from "@/redux/index.js"
import { APP_BASE_URL } from "./config";
 

  

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout/></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element:<ProtectedRoutes><Home/></ProtectedRoutes>,
      },
      {
        path: "/profile/:id",
        element: <ProtectedRoutes><Profile/></ProtectedRoutes>,
      },
      {
        path: "/account/edit",
        element: <ProtectedRoutes><EditProfile/></ProtectedRoutes>,
      },
      {
        path: "/chat",
        element: <ProtectedRoutes><ChatPage/></ProtectedRoutes> ,
      },
      {
        path: "/search",
        element: <ProtectedRoutes><SearchTab/></ProtectedRoutes> ,
      },
      {
        path: "/suggestedusers",
        element: <ProtectedRoutes><SuggestedUsersPage/></ProtectedRoutes> ,
      },
      {
        path : "/reels/random",
        element: <ProtectedRoutes><Reels/></ProtectedRoutes>
      },
      {
        path:"/explore",
        element:<ProtectedRoutes><Explore/></ProtectedRoutes>
      },
    ],
  },

  {
    path: "/login",
    element:  <Login />,
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
      const socketio = io(`http://localhost:8000` , {
        query:{
          userId:user?._id
        },
        transports:['websocket'] //network me bohot sari api call ho rahi hoti hai toh usko reduce karne ke liye iska use kia
      });
      dispatch(setSocket(socketio))

      //listening all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))});

      //for notification alert 
      socketio.on('notification',(notification)=>{
        dispatch(setlikeNotiList(notification));
      })  

       

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
