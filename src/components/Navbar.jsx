import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, Search, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import user from "../assets/images/user.png";
import logo from "../assets/images/logoblack.png";

const Navbar = ({ toggleSidebar }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [hasNotifications, setHasNotifications] = useState(true);
    const menuRef = useRef();
    const searchRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target) && showSearch) {
                setShowSearch(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showSearch]);

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        navigate("/admin/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
        // Implement search functionality
        setShowSearch(false);
    };

    return (
        <header className="fixed top-0 left-0 w-full h-16 z-50 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
            {/* Left: Toggle + Logo */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} className="text-gray-700" />
                </button>
                <img
                    src={logo || "/placeholder.svg"}
                    alt="Logo"
                    className="h-8 md:h-9 object-contain"
                />
            </div>

            {/* Middle: Search (Desktop) */}
            <div className="hidden md:block flex-grow max-w-md mx-4">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                </form>
            </div>

            {/* Right: Search (Mobile) + Notifications + User Avatar */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Mobile Search Toggle */}
                <div className="md:hidden relative" ref={searchRef}>
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Search"
                    >
                        <Search size={20} className="text-gray-700" />
                    </button>

                    {showSearch && (
                        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-3 z-50 animate-fadeIn">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    autoFocus
                                />
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                            </form>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
                        aria-label="Notifications"
                    >
                        <Bell size={20} className="text-gray-700" />
                        {hasNotifications && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>
                </div>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center gap-2 py-1 pl-1 pr-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-expanded={showMenu}
                        aria-haspopup="true"
                    >
                        <img
                            src={user || "/placeholder.svg"}
                            alt="User"
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                        <ChevronDown size={16} className={`text-gray-600 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50 animate-fadeIn">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="font-medium text-gray-900">Admin User</p>
                                <p className="text-sm text-gray-500">admin@example.com</p>
                            </div>

                            <button
                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                onClick={() => {
                                    setShowMenu(false);
                                    navigate("profile");
                                }}
                            >
                                <User size={16} className="text-gray-500" />
                                <span>Profile</span>
                            </button>

                            <button
                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                onClick={() => {
                                    setShowMenu(false);
                                    navigate("settings");
                                }}
                            >
                                <Settings size={16} className="text-gray-500" />
                                <span>Settings</span>
                            </button>

                            <div className="border-t border-gray-100 my-1"></div>

                            <button
                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors duration-150"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} className="text-red-500" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// Add this to your global CSS or in a style tag
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
`;

export default Navbar;