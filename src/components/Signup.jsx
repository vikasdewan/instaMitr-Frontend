import { Label } from  './ui/label.jsx'
import React from 'react'
import { Input } from './ui/input.jsx'

function signup() {
  return (
    <div className='flex items-center w-screen h-screen justify-center bg-black text-white'>
        <form action="" className='shadow-white shadow-lg flex flex-col gap-3 p-8 w-7 '>
            <div className='my-4'>
            <h1>Logo</h1>
            <p>signup to see photos and videos from your Friends</p>
            </div>
            <div>
                
                <Input
                type ="text"
                placeholder="email"
                name = "email"
                className = "text-black focus-visible:ring-transparent" 
                />
            </div>
            <div>
               
                <Input
                type ="text"
                placeholder="password"
                name = "password"
                className = "text-black focus-visible:ring-transparent  " 
                />
            </div>
            <div>
               
                <Input
                type ="text"
                placeholder="username"
                name = "username"
                className = "text-black focus-visible:ring-transparent  " 
                />
            </div>
        </form>
        
        </div>
  )
}

export default signup