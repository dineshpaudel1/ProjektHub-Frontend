import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../pages/admin/AdminNav";
import SellerSidebar from "../pages/seller/SellerSidebar";
import SellerNav from "../pages/seller/SellerNav";

const SellerLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <div>
            {/* Fixed Navbar */}
            <SellerNav toggleSidebar={toggleSidebar} />

            {/* Fixed Sidebar */}
            <SellerSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ease-in-out ${isCollapsed ? "ml-20" : "ml-64"
                    } pt-[60px] h-[calc(100vh-60px)] overflow-y-auto bg-gray-50 p-6`}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default SellerLayout;
