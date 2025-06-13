import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, Search, User, ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import user from "../../assets/images/user.png";
import logo from "../../assets/images/logoblack.png";
import axios from "../../utils/axiosInstance";

const SellerNav = ({ toggleSidebar }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const menuRef = useRef();
    const searchRef = useRef();
    const notificationRef = useRef();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchSellerNotifications = async () => {
            try {
                const res = await axios.get("/notifications?role=SELLER", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(res.data?.data || []);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        if (token) {
            fetchSellerNotifications();
        }
    }, [token]);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
            if (searchRef.current && !searchRef.current.contains(e.target) && showSearch) setShowSearch(false);
            if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showSearch]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/seller/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
        setShowSearch(false);
    };

    const getUserInfo = () => {
        try {
            if (!token) return { username: "User", email: "" };
            const payload = JSON.parse(atob(token.split(".")[1]));
            return { username: payload.username || "User", email: payload.sub || "" };
        } catch {
            return { username: "User", email: "" };
        }
    };

    const { username, email } = getUserInfo();

    return (
        <header className="fixed top-0 left-0 w-full h-16 z-50 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
            {/* Left: Sidebar toggle & logo */}
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <Menu size={20} className="text-gray-700" />
                </button>
                <img src={logo || "/placeholder.svg"} alt="Logo" className="h-8 md:h-9 object-contain" />
            </div>

            {/* Middle: Search Desktop */}
            <div className="hidden md:block flex-grow max-w-md mx-4">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </form>
            </div>

            {/* Right: Search Mobile + Notifications + User Menu */}
            <div className="flex items-center gap-2 md:gap-4">

                {/* Mobile Search */}
                <div className="md:hidden relative" ref={searchRef}>
                    <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-full hover:bg-gray-100">
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
                                    className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </form>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button onClick={() => setShowNotifications(prev => !prev)} className="p-2 rounded-full hover:bg-gray-100 relative">
                        <Bell size={20} className="text-gray-700" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl z-50 animate-fadeIn">
                            <div className="flex justify-between px-4 py-3 border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                                <span className="text-xs text-white bg-blue-600 rounded-full px-2 py-0.5">
                                    {notifications.length} New
                                </span>
                            </div>

                            <div className="px-4 py-3 text-sm text-gray-600 space-y-3 max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <p className="text-gray-500 text-center">No new notifications</p>
                                ) : (
                                    notifications.map((note) => (
                                        <div
                                            key={note.id}
                                            className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                            onClick={() => {
                                                if (note.targetType === "QUESTION") {
                                                    navigate(`/seller/questions/${note.targetId}`);
                                                    setShowNotifications(false);
                                                }
                                            }}
                                        >
                                            <img
                                                src={note.photoUrl}
                                                alt="Notification"
                                                className="w-9 h-9 rounded-full mt-1 object-cover border"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{note.message}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(note.timeStamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Avatar and Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 py-1 pl-1 pr-2 rounded-full hover:bg-gray-100">
                        <img src={user || "/placeholder.svg"} alt="User" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                        <ChevronDown size={16} className={`text-gray-600 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50 animate-fadeIn">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="font-medium text-gray-900">{username}</p>
                                <p className="text-sm text-gray-500">{email}</p>
                            </div>

                            <button className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                                onClick={() => { setShowMenu(false); navigate("profile"); }}>
                                <User size={16} className="text-gray-500" />
                                <span>Profile</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default SellerNav;
