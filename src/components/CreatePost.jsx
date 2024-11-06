import React from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function CreatePost({open,setOpen}) {


    const createPostHandler = async(e)=>{
        e.preventDefault();
        try {
            

        } catch (error) {
            console.log(error)
        }
    }
  return (
    <>
    <Dialog open={open}>
        <DialogContent onInteractOutside={()=> setOpen(false)} className="bg-black text-white" >
        <DialogHeader className="flex items-center font-bold text-lg">Create New Post</DialogHeader>
        <div className='flex gap-3 items-center '>
            <Avatar >
                <AvatarImage src="" alt="user_Image"/>
                <AvatarFallback className="text-white bg-pink-700">IM</AvatarFallback>
            </Avatar>
            <div>
                <h1 className='font-semibold text-xs'>Username</h1>
                <span className='text-gray-600 text-xs' >Bio Here...</span>
            </div>
        </div>
        </DialogContent>
    </Dialog>
    </>
  )
}

export default CreatePost