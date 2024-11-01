

import { Heart, Home, LogOut, MessageCircle, PlaySquare, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import { Avatar,AvatarImage,AvatarFallback } from './ui/avatar'
 
const sideBarItems = [
    {icon : <Home/> , text:"Home"},
    {icon : <Search/> , text:"Search"},
    {icon : <TrendingUp/> , text:"Explore"},
    {icon : <PlaySquare/> , text:"Reels"},
    {icon : <MessageCircle/> , text:"Messages"},
    {icon : <Heart/> , text:"Notifications"},
    {icon : <PlusSquare/> , text:"Create"},
    {icon : (
      <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>IM</AvatarFallback>
</Avatar>
    ) , text:"Profile"},
    {icon : <LogOut/> , text:"logout"},
]


function LeftSideBar() {
  return (
    <div>LeftSideBar</div>
  )
}

export default LeftSideBar