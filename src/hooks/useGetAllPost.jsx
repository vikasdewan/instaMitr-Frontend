import { setPosts } from "@/redux/postSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAllPost = ()=>{
    useEffect(() =>{
        const dispatch = useDispatch(); //basically kuch chij bhejne ka kaam karta hai

        const fetchAllPost = async () =>{
            try {
                const res = await axios.get('http://localhost:8000/api/v1/post/all',{withCredentials:true})
                if(res.data.success){
                        dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                    console.log(error)
            }
        }
    })
}


