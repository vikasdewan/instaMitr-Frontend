import React from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
import BottomBar from "./BottomBar"; // Import BottomBar

function MainLayout() {
  return (
    <div className="flex flex-col md:flex-row">
      <LeftSideBar className="hidden md:flex" /> {/* Hide on small screens */}
      <div className="flex-grow">
        <Outlet />
      </div>
      <BottomBar className="md:hidden" /> {/* Show on small screens */}
    </div>
  );
}

export default MainLayout;
