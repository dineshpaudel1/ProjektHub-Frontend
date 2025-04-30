import React from "react";
import { Home, HelpCircle, LogOut } from 'lucide-react';
import { useLocation, Link } from "react-router-dom";
import { FaFolderOpen, FaRegFolder } from 'react-icons/fa';

const Sidebar = ({ isCollapsed }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname.includes(path);

    return (
        <aside
            // Make sidebar fixed from top (after navbar at 60px) to bottom, and set width based on collapse state.
            className={`fixed top-[60px] left-0 bottom-0 transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"
                } bg-white shadow-sm overflow-y-auto`}
        >
            {/* Sidebar Content */}
            <div className="flex flex-col h-full py-6">
                {/* Main Navigation */}
                <div className="px-4 mb-6">
                    {!isCollapsed && (
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                            Main
                        </h2>
                    )}
                    <nav className="flex flex-col gap-2">
                        <Link
                            to="dashboard"
                            className={`flex items-center ${isCollapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
                                } rounded-lg transition-all duration-200 ${isActive("dashboard")
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
                                <div className={isActive("dashboard") ? "text-blue-600" : ""}>
                                    <Home size={isCollapsed ? 22 : 18} strokeWidth={isActive("dashboard") ? 2.5 : 2} />
                                </div>
                                {!isCollapsed && <span>Dashboard</span>}
                            </div>
                            {!isCollapsed && isActive("dashboard") && (
                                <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></div>
                            )}
                        </Link>
                        <Link
                            to="adminproject"
                            className={`flex items-center ${isCollapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
                                } rounded-lg transition-all duration-200 ${isActive("adminproject")
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
                                <div className={isActive("adminproject") ? "text-blue-600" : ""}>
                                    <FaFolderOpen size={isCollapsed ? 22 : 18} />
                                </div>
                                {!isCollapsed && <span>All Projects</span>}
                            </div>
                            {!isCollapsed && isActive("adminproject") && (
                                <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></div>
                            )}
                        </Link>
                        <Link
                            to="sellerproject"
                            className={`flex items-center ${isCollapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
                                } rounded-lg transition-all duration-200 ${isActive("sellerproject")
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
                                <div className={isActive("sellerproject") ? "text-blue-600" : ""}>
                                    <FaRegFolder size={isCollapsed ? 22 : 18} />
                                </div>
                                {!isCollapsed && <span>Seller Projects</span>}
                            </div>
                            {!isCollapsed && isActive("sellerproject") && (
                                <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></div>
                            )}
                        </Link>
                    </nav>
                </div>

                {/* Spacer */}
                <div className="flex-grow"></div>

                {/* Footer */}
                <div className={`px-4 mt-auto ${isCollapsed ? "text-center" : ""}`}>
                    {!isCollapsed ? (
                        <div className="border-t border-gray-200 pt-4 px-2">
                            <Link
                                to="/help"
                                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
                            >
                                <HelpCircle size={18} />
                                <span className="text-sm">Help & Support</span>
                            </Link>
                            <Link
                                to="/logout"
                                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
                            >
                                <LogOut size={18} />
                                <span className="text-sm">Log Out</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="border-t border-gray-200 pt-4 flex flex-col items-center gap-4">
                            <Link
                                to="/help"
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2"
                                aria-label="Help & Support"
                            >
                                <HelpCircle size={20} />
                            </Link>
                            <Link
                                to="/logout"
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2"
                                aria-label="Log Out"
                            >
                                <LogOut size={20} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
