import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, ShoppingCart, Bell } from "lucide-react";
import logowhite from "../../assets/images/logowhite.png";
import logoDark from "../../assets/images/logoblack.png";
import { useUser } from "../../context/UserContext";
import SellerRegisterModal from "../../modals/SellerRegisterModal";
import { protectedApi, publicApi } from "../../utils/axiosInstance";
import userphoto from "../../assets/images/user.png";
import { useTheme } from "next-themes";

const UserNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useUser();

    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSellerModal, setShowSellerModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = notifications.filter((n) => !n.read).length;
    const oneTapInitialized = useRef(false);

    const { theme, setTheme } = useTheme();
    const toggleDarkMode = () => setTheme(theme === "dark" ? "light" : "dark");


    const handleSectionClick = (sectionId) => {
        if (location.pathname !== "/") {
            navigate(`/#${sectionId}`);
        } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (user || location.pathname === "/login" || oneTapInitialized.current) return;

        if (window.google) {
            oneTapInitialized.current = true;

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    try {
                        const res = await publicApi.post('/auth/login/google', { token: response.credential });
                        const { accessToken, refreshToken } = res.data.data;
                        localStorage.setItem("token", accessToken);
                        localStorage.setItem("refreshToken", refreshToken);
                        const userRes = await protectedApi.get("/user/me");
                        setUser(userRes.data);
                        navigate("/");
                    } catch (err) {
                        console.error("One Tap Login Failed:", err);
                        window.google.accounts.id.prompt((notif) => console.log(notif));
                    }
                },
                auto_select: true,
                cancel_on_tap_outside: false,
            });

            window.google.accounts.id.prompt((notif) => {
                console.log("One Tap status:", notif);
            });
        }
    }, [user, location.pathname]);

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
                const res = await protectedApi.get("/notifications?role=USER");
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
        localStorage.clear();
        setUser(null);
        navigate("/login");
    };

    useEffect(() => {
        document.body.style.overflow = showSellerModal ? "hidden" : "auto";
    }, [showSellerModal]);

    return (
        <div className="fixed top-0 left-0 w-full z-50">
            <nav
                className="px-6 py-4 flex justify-between items-center backdrop-blur-md border-b"
                style={{
                    backgroundColor: "var(--navbar-bg)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                }}
            >
                {/* Logo */}
                <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                    <img src={theme === "dark" ? logowhite : logoDark} alt="Logo" className="h-8 w-auto" />
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search your project name"
                            className="rounded-full px-4 py-2 pl-10 w-[280px] text-black bg-gray-100 text-sm focus:outline-none"
                        />
                        <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                        </svg>
                    </div>
                    <a onClick={() => handleSectionClick("home")} className="text-sm hover:text-blue-600 transition font-medium cursor-pointer">Home</a>
                    <a onClick={() => navigate("/", { state: { scrollTo: "projects" } })} className="text-sm hover:text-blue-600 transition font-medium cursor-pointer">Project</a>
                    <a onClick={() => navigate("/", { state: { scrollTo: "services" } })} className="text-sm hover:text-blue-600 transition font-medium cursor-pointer">Services</a>
                    <a onClick={() => navigate("/", { state: { scrollTo: "about" } })} className="text-sm hover:text-blue-600 transition font-medium cursor-pointer">About Us</a>
                </div>

                {/* Right */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button onClick={toggleDarkMode} className="p-2 rounded-md border border-gray-400 hover:bg-gray-100 transition">
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Orders */}
                    {user && (
                        <Link to="/my-orders" className="hover:text-blue-600">
                            <ShoppingCart size={18} />
                        </Link>
                    )}

                    {/* Notifications */}
                    {user && (
                        <div className="relative notification-dropdown">
                            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-gray-100 transition">
                                <Bell size={18} />
                            </button>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 h-4 min-w-[1rem] flex items-center justify-center">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                            {showNotifications && (
                                <div className={`absolute right-0 mt-2 w-72 max-h-[400px] overflow-y-auto rounded-md shadow-lg py-2 z-50 border ${theme === "dark" ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-800 border-gray-200"}`}>
                                    {loadingNotifications ? (
                                        <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                                    ) : notifications.length > 0 ? (
                                        notifications.map((note) => (
                                            <div key={note.id}
                                                className={`px-4 py-2 text-sm border-b flex items-start gap-2 cursor-pointer hover:bg-gray-100 ${theme === "dark" ? "border-gray-800" : "border-gray-100"}`}
                                                onClick={async () => {
                                                    try {
                                                        await protectedApi.put(`/notifications/${note.id}/read`);
                                                        setNotifications(prev => prev.map(n => (n.id === note.id ? { ...n, read: true } : n)));
                                                        if (note.targetType === "ORDER") navigate(`/my-order/${note.targetId}`);
                                                        else if (note.targetType === "PROJECT") navigate(`/project/${note.targetId}`);
                                                    } catch (err) {
                                                        console.error("Failed to mark notification as read", err);
                                                    } finally {
                                                        setShowNotifications(false);
                                                    }
                                                }}>
                                                <img src={note.photoUrl ? `http://localhost:8080/api/media/photo?file=${note.photoUrl}` : userphoto} alt="notif" className="w-8 h-8 object-cover rounded" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{note.message}</p>
                                                    <p className="text-xs text-gray-500">{new Date(note.timeStamp).toLocaleString()}</p>
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
                                    <img src={`http://localhost:8080/api/media/photo?file=${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <span className="text-sm font-semibold text-white bg-indigo-600 w-full h-full flex items-center justify-center rounded-full">{user.username?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            {dropdownOpen && (
                                <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 z-50 border ${theme === "dark" ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-800 border-gray-200"}`}>
                                    <button onClick={() => { setDropdownOpen(false); navigate("/userprofile"); }} className={`w-full px-4 py-2 text-sm text-left ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>Profile</button>
                                    <button onClick={handleLogout} className={`w-full px-4 py-2 text-sm text-left text-red-600 ${theme === "dark" ? "hover:bg-red-700" : "hover:bg-red-100"}`}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => navigate("/login")} className="bg-blue-600 text-white font-medium rounded px-6 py-2 hover:bg-blue-700 transition">
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden z-30">
                    <button onClick={() => setIsOpen(!isOpen)} style={{ color: "var(--text-color)" }}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-40 overflow-y-auto" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                        <div className="flex items-center gap-3">
                            <img src={theme === "dark" ? logowhite : logoDark} alt="Logo" className="h-6 sm:h-7" />
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-xl"><X size={24} /></button>
                    </div>

                    <ul className="px-6 py-6 space-y-6 text-lg font-medium">
                        <li><a onClick={() => { setIsOpen(false); handleSectionClick("home"); }} className="block hover:text-indigo-500">Home</a></li>
                        <li><a onClick={() => { setIsOpen(false); handleSectionClick("projects"); }} className="block hover:text-indigo-500">Projects</a></li>
                        <li><a onClick={() => { setIsOpen(false); handleSectionClick("services"); }} className="block hover:text-indigo-500">Our Services</a></li>
                        <li><a onClick={() => { setIsOpen(false); handleSectionClick("about"); }} className="block hover:text-indigo-500">About Us</a></li>
                    </ul>

                    <div className="px-6 py-4 space-y-4">
                        <button onClick={toggleDarkMode} className="w-full flex items-center justify-center gap-2 border py-2 rounded-full font-medium"
                            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--hover-bg)" }}>
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </button>

                        {user ? (
                            <>
                                <button onClick={() => { setIsOpen(false); navigate("/userprofile"); }} className="w-full bg-gray-500 text-white py-2 rounded-full font-medium">
                                    Profile
                                </button>
                                <button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 rounded-full font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { setIsOpen(false); navigate("/login"); }} className="w-full bg-indigo-600 text-white py-2 rounded-full font-medium">
                                Login
                            </button>
                        )}
                    </div>
                </div>
            )}

            {showSellerModal && <SellerRegisterModal onClose={() => setShowSellerModal(false)} />}
        </div>
    );
};

export default UserNavbar;
