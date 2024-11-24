import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { AtSign, Grid, MoreHorizontal, Plus, Settings,UserSquare } from 'lucide-react';
import { Badge } from './ui/badge';

function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const {userProfile} = useSelector((store) => store.auth);
  const isLoggedInUserProfile = true;
  const isFollowing = false;

  return (
    <div className='text-white h-screen bg-black flex w-screen justify-center ml-20 pl-10  '>
      <div className='flex flex-col gap-20 p-8'>
      <div className='grid grid-cols-2'>
        <section className='flex items-center justify-center mt-3 ml-3'>
      <Avatar className="h-32 w-32">
        <AvatarImage src={userProfile?.profileImage} alt="profile_Img"/>
        <AvatarFallback>IM</AvatarFallback>
      </Avatar>
        </section>
        <section >
          <div className='flex flex-col gap-5'>
            <div className='flex gap-2 items-center'>
            <span className='font-semibold text-xl'>{userProfile?.username}</span> 
            {
              isLoggedInUserProfile ? (  
            <>
            <Button className="bg-gray-700 text-white font-semibold hover:bg-gray-800 h-8" variant="secondary">Edit Profile</Button>
            <Button className="hover:bg-gray-800 h-8 bg-gray-700 text-white font-semibold" variant="secondary">View archive</Button>
            <Settings className="text-2xl hover:text-gray-200" />
            </>
              ) : (
                isFollowing ? (
                  <>
                  <Button className="bg-gray-700 text-white font-semibold hover:bg-gray-800 h-8" variant="secondary">Unfollow </Button>
                  <Button className="hover:bg-gray-800 h-8 bg-gray-700 text-white font-semibold" variant="secondary">Message</Button>
                  <div className='flex items-end  hover:text-gray-200'>
                  <User className="text-2xl " />
                  <Plus className="text-2xl size-3" />
                  </div>
                  <MoreHorizontal className="text-2xl hover:text-gray-200" />
                  </>

                ) :(  
                  <>
                  <Button className="bg-blue-600 text-white font-semibold hover:bg-blue-700 h-8" variant="secondary">Follow</Button>  
                  <MoreHorizontal className="text-2xl hover:text-gray-200" />
                  </>
                )
              )
            }
            </div>
            <div className='flex items-center justify-start gap-9'>
              <p><span className='font-semibold pr-1 text-lg'>{userProfile?.posts.length}</span>posts</p>
              <p><span className='font-semibold pr-1 text-lg'>{userProfile?.followers.length}</span>followers</p>
              <p><span className='font-semibold pr-1 text-lg'>{userProfile?.following.length}</span>following</p>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-semibold'>{userProfile?.bio || "bio here..."}</span>
              <Badge className="w-fit bg-gray-600 text-white hover:bg-gray-700 cursor-pointer" variant='secondary'><AtSign className='size-4'/><span>{userProfile?.username}</span></Badge>
              <span>MERN Stack💻 | DSA in JAVA🖥️ </span>
            </div>
          </div>
        </section>
      </div>
      <div className='border-t border-t-gray-200'>
              <div className='flex items-center justify-center gap-10 text-sm'>
                <div className='flex  items-center justify-center gap-1'>
              <Grid className="w-5 h-5 font-normal" />
              <span className='py-3 cursor-pointer font-normal'>
                POSTS
              </span>
                </div>
                <div className='flex  items-center justify-center gap-1'>
                <UserSquare className="w-5 h-5" strokeWidth={1.5} />
              <span className='py-3 cursor-pointer font-normal'>
                TAGGED
              </span>
                </div>
              </div>
      </div>
      </div>
    </div>
  )
}

export default Profile