 
import React from 'react'
 
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function story() {
    const { user } = useSelector((store) => store.auth);
  return (
    <div>
         <div className="flex item-center gap-2 mt-3 ">
        <Link to="#">
          <Avatar className="text-black bg-red-500 size-13">
            <AvatarImage src={user?.profileImage} alt="post_image" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
        </Link>
        </div>
         </div>
  )
}

export default story