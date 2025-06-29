import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../pages/user/UserNavbar";
import Footer from "../pages/user/Footer";
import { useTheme } from "next-themes";

const UserLayout = () => {
    const { theme } = useTheme(); // light or dark

    return (
        <div data-theme={theme} className="min-h-screen flex flex-col">
            <UserNavbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default UserLayout;
