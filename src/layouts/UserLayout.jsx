import React from "react";
import UserNavbar from "../components/UserNavbar";
import { Outlet } from "react-router-dom";
import Home from "../pages/user/Home";
const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#19191B] text-white">
            <UserNavbar />
            <Home />
            <footer className="bg-[#101010] text-gray-400 text-sm text-center py-6">
                © {new Date().getFullYear()} Project Mall. All rights reserved.
            </footer>
        </div>
    );
};

export default UserLayout;
