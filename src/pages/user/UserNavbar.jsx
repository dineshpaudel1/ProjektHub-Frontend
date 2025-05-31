// UserNavbar.jsx - Full code with mobile responsive notification modal

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, ShoppingCart, Bell } from "lucide-react";
import logowhite from "../../assets/images/logowhite.png";
import logoDark from "../../assets/images/logoblack.png";
import { useUser } from "../../context/UserContext";
import SellerRegisterModal from "../../modals/SellerRegisterModal";
import axios from "../../utils/axiosInstance";

const UserNavbar = () => {
    const navigate = useNavigate();
    const { user, setUser, roles } = useUser();

    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSellerModal, setShowSellerModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = notifications.filter((n) => !n.read).length;


    const isSeller = roles?.includes("SELLER");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleDarkMode = () => setTheme(prev => prev === "dark" ? "light" : "dark");

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".profile-dropdown")) setDropdownOpen(false);
            if (!e.target.closest(".notification-dropdown")) setShowNotifications(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            setLoadingNotifications(true);
            try {
                const res = await axios.get("/notifications?role=USER");
                setNotifications(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            } finally {
                setLoadingNotifications(false);
            }
        };
        fetchNotifications();
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUser(null);
        navigate("/login");
    };

    useEffect(() => {
        document.body.style.overflow = showSellerModal ? 'hidden' : 'auto';
    }, [showSellerModal]);

    return (
        <div className="fixed top-0 left-0 w-full z-50">
            <nav className="px-6 py-4 flex justify-between items-center backdrop-blur-md border-b" style={{ color: "var(--text-color)", backgroundColor: theme === "dark" ? "rgba(25, 25, 27, 0.3)" : "rgba(255, 255, 255, 0.7)", borderColor: "var(--border-color)" }}>
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}> <img src={theme === "dark" ? logowhite : logoDark} alt="Logo" className="h-8 w-auto" /> </div>
                <div className="hidden md:flex space-x-10">
                    <a onClick={() => navigate("/")} className="font-semibold hover:text-indigo-500 transition">Home</a>
                    <a onClick={() => navigate("/projects")} className="font-semibold hover:text-indigo-500 transition">Projects</a>
                    <a onClick={() => navigate("/services")} className="font-semibold hover:text-indigo-500 transition">Our Services</a>
                    <a onClick={() => navigate("/about")} className="font-semibold hover:text-indigo-500 transition">About Us</a>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button onClick={toggleDarkMode} className="p-2 rounded-full transition" style={{ backgroundColor: "var(--hover-bg)" }}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
                    {user && (
                        <Link to="/my-orders" className="hover:text-indigo-500">
                            <ShoppingCart />
                        </Link>
                    )}

                    {/* Notification Bell */}
                    {user && (
                        <div className="relative notification-dropdown">
                            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full transition" style={{ backgroundColor: "var(--hover-bg)" }}>
                                <Bell size={18} />
                            </button>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 h-4 min-w-[1rem] flex items-center justify-center">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                            {showNotifications && (
                                <div
                                    className={`absolute right-0 mt-2 w-72 max-h-[400px] overflow-y-auto rounded-md shadow-lg py-2 z-50 border ${theme === "dark"
                                        ? "bg-gray-900 text-white border-gray-700"
                                        : "bg-white text-gray-800 border-gray-200"
                                        }`}
                                >
                                    {loadingNotifications ? (
                                        <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                                    ) : notifications.length > 0 ? (
                                        notifications.map((note) => (
                                            <div
                                                key={note.id}
                                                className={`px-4 py-2 text-sm border-b flex items-start gap-2 cursor-pointer hover:bg-gray-100 ${theme === "dark" ? "border-gray-800" : "border-gray-100"
                                                    }`}
                                                onClick={() => {
                                                    navigate("/my-orders");
                                                    setShowNotifications(false);
                                                }}
                                            >
                                                {note.photoUrl && (
                                                    <img
                                                        src={`http://localhost:8080/api/media/photo?file=${note.photoUrl}`}
                                                        alt="projkthub"
                                                        className="w-8 h-8 object-cover rounded"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium">{note.message}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(note.timeStamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-500">No notifications</div>
                                    )}
                                </div>
                            )}

                        </div>
                    )}

                    {/* Profile or Login */}
                    {user ? (
                        <div className="relative profile-dropdown">
                            <div onClick={() => setDropdownOpen(!dropdownOpen)} className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer border border-gray-400">
                                {user.profilePicture ? (
                                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <span className="text-sm font-semibold text-white bg-indigo-600 w-full h-full flex items-center justify-center rounded-full">{user.username?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            {dropdownOpen && (
                                <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 z-50 border ${theme === "dark" ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-800 border-gray-200"}`}>
                                    <button onClick={() => { setDropdownOpen(false); navigate("/userprofile"); }} className={`w-full px-4 py-2 text-sm text-left transition ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>Profile</button>
                                    <button onClick={handleLogout} className={`w-full px-4 py-2 text-sm text-left text-red-600 transition ${theme === "dark" ? "hover:bg-red-700" : "hover:bg-red-100"}`}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => navigate("/login")} className="bg-indigo-600 text-white font-medium rounded-full px-5 py-2 hover:bg-indigo-700 transition">Login</button>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden z-30">
                    <button onClick={() => setIsOpen(!isOpen)} style={{ color: "var(--text-color)" }}>{isOpen ? <X /> : <Menu />}</button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-40 overflow-y-auto" style={{ backgroundColor: theme === "dark" ? "#111827" : "#ffffff", color: theme === "dark" ? "#ffffff" : "#111827" }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: theme === "dark" ? "#374151" : "#e5e7eb" }}>
                        <div className="flex items-center gap-3">
                            <img src={theme === "dark" ? logowhite : logoDark} alt="Logo" className="h-6 sm:h-7" />
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-xl"><X size={24} /></button>
                    </div>
                    <ul className="px-6 py-6 space-y-6 text-lg font-medium">
                        <li><a onClick={() => setIsOpen(false)} href="#projects" className="block hover:text-indigo-500">Projects</a></li>
                        <li><a onClick={() => setIsOpen(false)} href="#services" className="block hover:text-indigo-500">Our Services</a></li>
                        <li><a onClick={() => setIsOpen(false)} href="#about" className="block hover:text-indigo-500">About Us</a></li>
                    </ul>
                    <div className="px-6 space-y-4 pb-8">
                        <button onClick={toggleDarkMode} className="w-full flex items-center justify-center gap-2 border py-2 rounded-full font-medium" style={{ borderColor: theme === "dark" ? "#4b5563" : "#d1d5db", backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb" }}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}{theme === "dark" ? "Light Mode" : "Dark Mode"}</button>
                        {user ? (
                            <button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 rounded-full font-medium">Logout</button>
                        ) : (
                            <button onClick={() => { setIsOpen(false); navigate("/login"); }} className="w-full bg-indigo-600 text-white py-2 rounded-full font-medium">Login</button>
                        )}
                    </div>
                </div>
            )}

            {showSellerModal && (
                <SellerRegisterModal onClose={() => setShowSellerModal(false)} />
            )}
        </div>
    );
};

export default UserNavbar;
