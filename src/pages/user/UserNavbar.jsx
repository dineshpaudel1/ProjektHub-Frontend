import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Menu,
    X,
    Moon,
    Sun,
    Search,
    Bell,
    ShoppingCart,
} from "lucide-react";

import logowhite from "../../assets/images/logowhite.png";
import logoDark from "../../assets/images/logoblack.png";
import { useUser } from "../../context/UserContext";
import SellerRegisterModal from "../../modals/SellerRegisterModal";
import { protectedApi, publicApi } from "../../services/axiosInstance";
import { useTheme } from "next-themes";
import NotificationDropdown from "../../components/notification/NotificationDropdown";
import ProfileDropdown from "../../components/user/ProfileDropdown";

const UserNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useUser();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSellerModal, setShowSellerModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");

    const handleSearch = async (e) => {
        if (e.key === "Enter" && searchKeyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
        }
    };


    const oneTapInitialized = useRef(false);
    const { theme, setTheme } = useTheme();
    const unreadCount = notifications.filter((n) => !n.read).length;

    const toggleDarkMode = () => setTheme(theme === "dark" ? "light" : "dark");

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/login");
    };

    const handleSectionClick = (sectionId) => {
        if (location.pathname !== "/") {
            navigate(`/#${sectionId}`);
        } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("token");

        if (user || accessToken || oneTapInitialized.current || location.pathname === "/login") return;

        const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!CLIENT_ID || !window.google?.accounts?.id) return;

        localStorage.setItem("redirectAfterLogin", location.pathname);
        oneTapInitialized.current = true;

        window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: async (response) => {
                try {
                    const idToken = response.credential;
                    const res = await publicApi.post("/auth/login/google", { token: idToken });
                    const { accessToken, refreshToken } = res.data.data;

                    localStorage.setItem("token", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);

                    const userRes = await protectedApi.get("/user/me");
                    setUser(userRes.data);

                    const redirectPath =
                        location.state?.from || localStorage.getItem("redirectAfterLogin") || "/";
                    localStorage.removeItem("redirectAfterLogin");
                    navigate(redirectPath);
                } catch (err) {
                    console.error("Google One Tap login failed:", err);
                }
            },
            auto_select: true,
            cancel_on_tap_outside: false,
            context: "signin",
        });

        window.google.accounts.id.prompt();
    }, [user, location.pathname]);

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".profile-dropdown")) setDropdownOpen(false);
            if (!e.target.closest(".notification-dropdown")) setShowNotifications(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

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
                    <img
                        src={theme === "dark" ? logowhite : logoDark}
                        alt="Logo"
                        className="h-8 w-auto"
                    />
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8 ml-[250px]">
                    <a onClick={() => handleSectionClick("home")} className="text-sm hover:text-blue-600 transition font-medium cursor-pointer">Home</a>
                    <a onClick={() => navigate("/", { state: { scrollTo: "projects" } })} className="text-sm hover:text-blue-600 transition font-medium cursor-pointer">Project</a>
                    <a onClick={() => navigate("/", { state: { scrollTo: "services" } })} className="text-sm hover:text-blue-600 transition font-medium cursor-pointer">Services</a>
                    <a onClick={() => navigate("/", { state: { scrollTo: "about" } })} className="text-sm hover:text-blue-600 transition font-medium cursor-pointer">About Us</a>
                </div>

                {/* Right Side */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search your project name"
                            className="rounded-full px-4 py-2 pl-10 w-[280px] text-sm focus:outline-none transition-all duration-300 border-1 shadow-sm focus:shadow-sm"
                            style={{
                                backgroundColor: "var(--bg-color)",
                                color: "var(--text-secondary)",
                                borderColor: "var(--border-color)",
                                caretColor: "var(--text-secondary)",
                            }}
                        />

                        <Search
                            size={16}
                            className="absolute left-3 top-2.5 pointer-events-none"
                            style={{ color: "var(--text-secondary)" }}
                        />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-md border hover:shadow-sm transition-all duration-300"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            color: "var(--text-secondary)",
                            borderColor: "var(--border-color)",
                        }}
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Orders */}
                    {user && (
                        <Link to="/my-orders" className="transition hover:text-blue-600" style={{ color: "var(--text-secondary)" }}>
                            <ShoppingCart size={18} />
                        </Link>
                    )}

                    {/* Notifications */}
                    {user && (
                        <NotificationDropdown
                            notifications={notifications}
                            setNotifications={setNotifications}
                            unreadCount={unreadCount}
                            loadingNotifications={loadingNotifications}
                            showNotifications={showNotifications}
                            setShowNotifications={setShowNotifications}
                        />
                    )}

                    {/* Profile or Login */}
                    {user ? (
                        <ProfileDropdown
                            user={user}
                            dropdownOpen={dropdownOpen}
                            setDropdownOpen={setDropdownOpen}
                            handleLogout={handleLogout}
                        />
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="font-medium rounded px-6 py-2 hover:shadow transition"
                            style={{
                                backgroundColor: "var(--button-primary, #2563eb)",
                                color: "#fff",
                            }}
                        >
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden z-30">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: "var(--text-color)" }}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 overflow-y-auto" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                        <img src={theme === "dark" ? logowhite : logoDark} alt="Logo" className="h-6 sm:h-7" />
                        <button onClick={() => setMobileMenuOpen(false)} className="text-xl"><X size={24} /></button>
                    </div>

                    <ul className="px-6 py-6 space-y-6 text-lg font-medium">
                        <li><a onClick={() => { setMobileMenuOpen(false); handleSectionClick("home"); }} className="block hover:text-indigo-500">Home</a></li>
                        <li><a onClick={() => { setMobileMenuOpen(false); handleSectionClick("projects"); }} className="block hover:text-indigo-500">Projects</a></li>
                        <li><a onClick={() => { setMobileMenuOpen(false); handleSectionClick("services"); }} className="block hover:text-indigo-500">Our Services</a></li>
                        <li><a onClick={() => { setMobileMenuOpen(false); handleSectionClick("about"); }} className="block hover:text-indigo-500">About Us</a></li>
                    </ul>

                    <div className="px-6 py-4 space-y-4">
                        <button onClick={toggleDarkMode} className="w-full flex items-center justify-center gap-2 border py-2 rounded-full font-medium"
                            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--hover-bg)" }}>
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </button>

                        {user ? (
                            <>
                                <button onClick={() => { setMobileMenuOpen(false); navigate("/userprofile"); }} className="w-full bg-gray-500 text-white py-2 rounded-full font-medium">
                                    Profile
                                </button>
                                <button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 rounded-full font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { setMobileMenuOpen(false); navigate("/login"); }} className="w-full bg-indigo-600 text-white py-2 rounded-full font-medium">
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
