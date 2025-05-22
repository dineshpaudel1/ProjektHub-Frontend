import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, Search, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import user from "../../assets/images/user.png";
import logo from "../../assets/images/logoblack.png";

const AdminNav = ({ toggleSidebar }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [unapprovedSellers, setUnapprovedSellers] = useState([]);


    const menuRef = useRef();
    const searchRef = useRef();
    const notificationRef = useRef();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

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

        const fetchUnapprovedSellers = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/admin/unapproved-sellers", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const json = await res.json();
                setUnapprovedSellers(json.data || []);

            } catch (err) {
                console.error("Error fetching unapproved sellers", err);
            }
        };

        fetchUnapprovedSellers();

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
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <Menu size={20} className="text-gray-700" />
                </button>
                <img src={logo} alt="Logo" className="h-8 md:h-9 object-contain" />
            </div>

            {/* Middle: Search (Desktop) */}
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

            {/* Right: Mobile Search + Notifications + Profile */}
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
                        {unapprovedSellers.length > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl z-50 animate-fadeIn">
                            <div className="flex justify-between px-4 py-3 border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                                <span className="text-xs text-white bg-blue-600 rounded-full px-2 py-0.5">
                                    {unapprovedSellers.length} New
                                </span>
                            </div>

                            <div className="px-4 py-3 text-sm text-gray-600 space-y-3 max-h-96 overflow-y-auto">
                                {unapprovedSellers.length === 0 ? (
                                    <p className="text-sm text-gray-500 p-4">No new seller requests.</p>
                                ) : (
                                    unapprovedSellers.map((seller) => (
                                        <div
                                            key={seller.id}
                                            className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                            onClick={() => navigate(`approve-seller/${seller.id}`)}
                                        >
                                            <img
                                                src={`http://localhost:8080/api/media/photo?file=${seller.verificationPhotoPath}`}
                                                alt={seller.sellerName}
                                                className="w-8 h-8 rounded-full mt-1 object-cover border"
                                            />
                                            <div className="flex-1">
                                                <p><strong>{seller.sellerName}</strong> has requested seller verification.</p>
                                                <p className="text-xs text-gray-400 mt-1">Click to view details</p>
                                            </div>
                                        </div>
                                    ))

                                )}
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

                            {/* <button
                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                    setShowMenu(false);
                                    navigate("settings");
                                }}
                            >
                                <Settings size={16} className="text-gray-500" />
                                <span>Settings</span>
                            </button> */}

                            <div className="border-t border-gray-100 my-1"></div>

                            {/* <button
                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} className="text-red-500" />
                                <span>Logout</span>
                            </button> */}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminNav;
