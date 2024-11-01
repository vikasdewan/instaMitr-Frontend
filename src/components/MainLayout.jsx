import React from "react";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      SideBar
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
