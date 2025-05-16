import React from "react";
import UserNavbar from "../pages/user/UserNavbar";
import { Outlet } from "react-router-dom";
import Home from "../pages/user/Home";
;
import Footer from "../pages/user/Footer";
const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#19191B] text-white">
            <UserNavbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default UserLayout;
