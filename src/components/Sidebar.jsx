import React from "react";
import { Home, Briefcase, Menu } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import logo from "../assets/images/logo.png"
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const location = useLocation();

    const links = [
        { name: "Home", path: "/Dashboard", icon: <Home size={20} /> },
        { name: "Projects", path: "/projects", icon: <Briefcase size={20} /> },
    ];

    return (
        <aside
            className={`transition-all duration-300 ${isCollapsed ? "w-20" : "w-60"
                } bg-white border-r border-gray-200 min-h-screen px-3 pt-4`}
        >
            {/* Logo + Toggle Button */}
            <div
                className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"
                    } mb-6 px-2`}
            >
                <img
                    src={logo}
                    alt="Logo"
                    className={`transition-all duration-300 ${isCollapsed ? "w-8 h-8" : "w-24"
                        }`}
                />
                {!isCollapsed && (
                    <button onClick={toggleSidebar}>
                        <Menu size={20} />
                    </button>
                )}
            </div>

            {/* Collapse Button Icon-only when collapsed */}
            {isCollapsed && (
                <div className="flex justify-center mb-4">
                    <button onClick={toggleSidebar}>
                        <Menu size={20} />
                    </button>
                </div>
            )}

            {/* Nav Links */}
            <nav className="flex flex-col gap-6 w-full items-center">
                {links.map((link) => {
                    const active = location.pathname === link.path;
                    return (
                        <Link
                            to={link.path}
                            key={link.name}
                            className={`flex items-center justify-center ${isCollapsed
                                ? "w-12 h-12 rounded-full"
                                : "w-full justify-start px-4 py-2.5 rounded-full"
                                } font-medium transition-all ${active
                                    ? "bg-[#e5e5e5] text-black"
                                    : "text-black hover:bg-gray-100"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {link.icon}
                                {!isCollapsed && <span>{link.name}</span>}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
