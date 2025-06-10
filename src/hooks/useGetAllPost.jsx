import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { APP_BASE_URL } from "@/config";

const useGetAllPost = () => {
  const dispatch = useDispatch(); //basically kuch chij bhejne ka kaam karta hai
  
  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  };


  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/post/all`, {
          withCredentials: true,
        });
        
        if (res.data.success) {
          const shuffledPosts = shuffleArray(res.data.posts); // Shuffle the posts
          dispatch(setPosts(shuffledPosts));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPost();
  }, []);
};

export default useGetAllPost;
