import {setAuthUser, setSuggestedUsers, setUserProfile} from "./authSlice.js";
import {setSelectedUser,
  setOnlineUsers,
  setMessages,
  updateMessageReaction,} from "./chatSlice.js";
import {setPosts, setSelectedPost} from "./postSlice.js";
import {setlikeNotiList} from "./realTimeNotiSlice.js";
import {setSocket} from "./socketSlice.js";
import {setComments, addComment, clearComments} from "./commentSlice.js";
import {default as store } from "./store.js"

export {
    setAuthUser,
    setSuggestedUsers,
    setUserProfile,
    setSelectedUser,
    setOnlineUsers,
    setMessages,
    updateMessageReaction,
    setPosts,
    setSelectedPost,
    setlikeNotiList,
    setSocket,
    setComments,
    addComment,
    clearComments,
    store
}
