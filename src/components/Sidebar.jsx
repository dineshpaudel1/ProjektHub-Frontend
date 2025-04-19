import React from "react";
import { Home, Briefcase, Menu } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { FaFolderOpen } from 'react-icons/fa';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname.includes(path);

    return (
        <aside
            className={`mt-[60px] transition-all duration-300 ${isCollapsed ? "w-20" : "w-60"
                } bg-white min-h-screen px-3 pt-4`}
            style={{ borderRight: "0.5px solid #6a6a6a" }}
        >

            {/* Nav Links (Manual) */}
            <nav className="flex flex-col gap-6 w-full items-center">
                {/* Home Link */}
                <Link
                    to="dashboard"
                    className={`flex items-center justify-center ${isCollapsed
                        ? "w-12 h-12 rounded-full"
                        : "w-full justify-start px-4 py-2.5 rounded-full"
                        } font-medium transition-all ${isActive("dashboard")
                            ? "bg-[#e5e5e5] text-black"
                            : "text-black hover:bg-gray-100"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <Home size={20} />
                        {!isCollapsed && <span>Home</span>}
                    </div>
                </Link>

                {/* Projects Link */}
                <Link
                    to="adminproject"
                    className={`flex items-center justify-center ${isCollapsed
                        ? "w-12 h-12 rounded-full"
                        : "w-full justify-start px-4 py-2.5 rounded-full"
                        } font-medium transition-all ${isActive("projects")
                            ? "bg-[#e5e5e5] text-black"
                            : "text-black hover:bg-gray-100"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <FaFolderOpen size={20} />
                        {!isCollapsed && <span>All Projects</span>}
                    </div>
                </Link>
                <Link
                    to="adminproject"
                    className={`flex items-center justify-center ${isCollapsed
                        ? "w-12 h-12 rounded-full"
                        : "w-full justify-start px-4 py-2.5 rounded-full"
                        } font-medium transition-all ${isActive("projects")
                            ? "bg-[#e5e5e5] text-black"
                            : "text-black hover:bg-gray-100"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <FaFolderOpen size={20} />
                        {!isCollapsed && <span>Our Projects</span>}
                    </div>
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
