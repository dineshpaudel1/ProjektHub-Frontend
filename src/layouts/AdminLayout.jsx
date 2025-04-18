import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar controlled by isCollapsed */}
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col">
                {/* Pass toggleSidebar to Navbar so toggle button works */}
                <Navbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-6 bg-gray-50 mt-[60px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
