import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  LeftSideBar,
  BottomBar,
} from "../layout/index.js";
import Loader from "./Loader.jsx";


function MainLayout() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { 
    // Simulate a delay for loading content, like fetching data 
    setTimeout(() => { setLoading(false); }, 100); // Adjust the timeout as needed 
    }, []);

  return (
    <>
    {loading ? 
    <Loader/> :
   
   <div className="flex flex-col md:flex-row">
      <LeftSideBar className="hidden md:flex" /> {/* Hide on small screens */}
      <div className="flex-grow">
        <Outlet />
      </div>
      <BottomBar className="md:hidden" /> {/* Show on small screens */}
    </div>
    
  }
    </>
    
  );
}

export default MainLayout;
