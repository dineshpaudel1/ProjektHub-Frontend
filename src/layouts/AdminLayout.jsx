import React, { useState } from "react";
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

const AdminLayout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="flex min-h-screen">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6 bg-gray-50">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
