import { Label } from  './ui/label.jsx'
import React from 'react'
import { Input } from './ui/input.jsx'
import { Button } from './ui/button.jsx'

function signup() {
  return (
    <div className='flex items-center w-screen h-screen justify-center bg-black text-white'>
        <form action="" className='shadow-white shadow-lg flex flex-col gap-1 p-7 w-96'>
            <div className='my-4'>
            <h1 className='text-center font-bold text-xl'>InstaMitr</h1>
            <p className='pl-2 text-sm text-center mt-2'>signup to see photos and videos from your Friends</p>
            </div>
            <div>
                <Label className = "font-medium pl-1">Username</Label>
                <Input
                type ="text"
                placeholder="username"
                name = "username"
                className = "text-black focus-visible:ring-transparent my-2 bg-slate-200" 
                />
            </div>
            <div>
                <Label className = "font-medium pl-1">Email</Label>
                <Input
                type ="email"
                placeholder="email"
                name = "email"
                className = "text-black focus-visible:ring-transparent my-2 bg-slate-200" 
                />
            </div>
            <div>
                <Label className = "font-medium pl-1">Password</Label>
                <Input
                type ="password"
                placeholder="password"
                name = "password"
                className = "text-black focus-visible:ring-transparent my-2 bg-slate-200" 
                />
            </div>

            <p className='text-xs text-center'>People who use our service may have uploaded your contact information to Instagrams.  <span className='text-blue-500'>Learn More</span></p>

            <p  className='text-xs text-center'>By signing up, you agree to our <span className='text-blue-500'>Terms</span> , <span className='text-blue-500'>Privacy Policy</span> and <span className='text-blue-500'>Cookie Policy</span> </p>


            <Button className="bg-slate-300 text-black mt-5 hover:bg-white">SignUp</Button>

        </form>
        
        </div>
  )
}

export default signup