import React from 'react'
import { useSelector } from 'react-redux'

function SuggestedUsers() {
    const {SuggestedUsers} = useSelector(store => store.auth)
  return (
    <div className='mt-5'> 
        <div className='flex justify-between ' >
            <h1 className='font-semibold text-gray-500 text-sm'>Suggested for you</h1>
            <span className='font-semibold text-xs mt-0.5 cursor-pointer text-gray-300 '>See All</span>
        </div>
    </div>
  )
}

export default SuggestedUsers