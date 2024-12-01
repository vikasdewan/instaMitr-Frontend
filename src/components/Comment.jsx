import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

function Comment({comment}) {
  return (
    <div className='my-2 md:px-4 sm:px-2'> 
      <div className='flex py-2 gap-3 items-start'>
        <Avatar className='md:w-12 md:h-12 sm:w-8 sm:h-8'>
          <AvatarImage src={comment?.author?.profileImage}/>
          <AvatarFallback>IM</AvatarFallback>
        </Avatar>
        <div className='flex flex-col sm:flex-col'>
          <h1 className='font-bold h-6 text-sm sm:text-sm'>{comment?.author?.username} &nbsp; &nbsp; </h1>
          <span className='ml-3 font-normal text-sm sm:text-sm'>{comment?.text}</span>
        </div>
      </div>
    </div>
  )
}

export default Comment
