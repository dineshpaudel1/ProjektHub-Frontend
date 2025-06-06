import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, Search, User, ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import user from "../../assets/images/user.png";
import logo from "../../assets/images/logoblack.png";
import axios from "../../utils/axiosInstance";

const AdminNav = ({ toggleSidebar }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [unapprovedSellers, setUnapprovedSellers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(n => !n.read).length + unapprovedSellers.length;


    const menuRef = useRef();
    const searchRef = useRef();
    const notificationRef = useRef();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const fetchAdminNotifications = async () => {
        try {
            const res = await axios.get("/notifications?role=ADMIN");
            setNotifications(res.data.data || []);
        } catch (err) {
            console.error("Error fetching admin notifications", err);
        }
    };

    // const fetchUnapprovedSellers = async () => {
    //     try {
    //         const res = await axios.get("/admin/unapproved-sellers");
    //         setUnapprovedSellers(res.data.data || []);
    //     } catch (err) {
    //         console.error("Error fetching unapproved sellers", err);
    //     }
    // };

    const getUserRoles = () => {
        try {
            if (!token) return [];
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.roles || [];
        } catch {
            return [];
        }
    };

    const getUsername = () => {
        try {
            if (!token) return "User";
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.username || "User";
        } catch {
            return "User";
        }
    };

    const getUserEmail = () => {
        try {
            if (!token) return "";
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.sub || "";
        } catch {
            return "";
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
            if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
            if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
        };
        document.addEventListener("mousedown", handler);

        fetchAdminNotifications();
        // fetchUnapprovedSellers();

        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        const roles = getUserRoles();
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAuthenticated");

        if (roles.includes("ADMIN")) {
            navigate("/admin/login");
        } else {
            navigate("/admin/login");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
        setShowSearch(false);
    };

    return (
        <header className="fixed top-0 left-0 w-full h-16 z-50 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
            {/* Left: Logo + Toggle */}
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100">
                    <Menu size={20} className="text-gray-700" />
                </button>
                <img src={logo} alt="Logo" className="h-8 md:h-9 object-contain" />
            </div>

            {/* Middle: Search */}
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

            {/* Right: Icons and Dropdown */}
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
                    <button
                        onClick={() => setShowNotifications(prev => !prev)}
                        className="p-2 rounded-full hover:bg-gray-100 relative"
                        aria-label="Notifications"
                    >
                        <Bell size={20} className="text-gray-700" />
                        {(notifications.length > 0 || unapprovedSellers.length > 0) && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl z-50 animate-fadeIn">
                            <div className="flex justify-between px-4 py-3 border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                                <span className="text-xs text-white bg-blue-600 rounded-full px-2 py-0.5">
                                    {notifications.length + unapprovedSellers.length} New
                                </span>
                            </div>

                            <div className="px-4 py-3 text-sm text-gray-600 space-y-3 max-h-96 overflow-y-auto">
                                {notifications.map((note) => (
                                    <div
                                        key={note.id}
                                        className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                        onClick={() => {
                                            if (note.targetType === "ORDER") {
                                                navigate(`/admin/orders/${note.targetId}`);
                                                setShowNotifications(false);
                                            }
                                        }}
                                    >
                                        <img
                                            src={note.photoUrl}
                                            alt={note.photoUrl}
                                            className="w-9 h-9 rounded-full mt-1 object-cover border"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{note.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(note.timeStamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {unapprovedSellers.map((seller) => (
                                    <div
                                        key={seller.id}
                                        className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                        onClick={() => navigate(`approve-seller/${seller.id}`)}
                                    >
                                        <img
                                            src={`http://localhost:8080/api/media/photo?file=${seller.verificationPhotoPath}`}
                                            alt={seller.sellerName}
                                            className="w-9 h-9 rounded-full mt-1 object-cover border"
                                        />
                                        <div className="flex-1">
                                            <p><strong>{seller.sellerName}</strong> has requested seller verification.</p>
                                            <p className="text-xs text-gray-400 mt-1">Click to view details</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center gap-2 py-1 pl-1 pr-2 rounded-full hover:bg-gray-100"
                        aria-expanded={showMenu}
                    >
                        <img src={user} alt="User" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                        <ChevronDown size={16} className={`text-gray-600 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50 animate-fadeIn">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="font-medium text-gray-900">{getUsername()}</p>
                                <p className="text-sm text-gray-500">{getUserEmail()}</p>
                            </div>

                            <button
                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                    setShowMenu(false);
                                    navigate("profile");
                                }}
                            >
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

export default AdminNav;
