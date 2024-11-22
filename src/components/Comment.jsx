 
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
 

function Comment({comment}) {
  return (
    <div className='my-2'> 
    <div className='flex gap-3 items-center'>
        <Avatar>
            <AvatarImage src={comment?.author?.profileImage}/>
            <AvatarFallback>
                IM
            </AvatarFallback>
        </Avatar>
        <div className='flex'>
        <h1 className='font-bold'>{comment?.author?.username} &nbsp;  &nbsp; </h1>
        <span className='font-normal'>{comment?.text}</span>
        </div>
    </div>
    </div>
  )
}

export default Comment