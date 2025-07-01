import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Search, ShoppingCart } from "lucide-react";

import logowhite from "../../assets/images/logowhite.png";
import logoDark from "../../assets/images/logoblack.png";

import { useUser } from "../../context/UserContext";
import { protectedApi, publicApi } from "../../services/axiosInstance";
import { useTheme } from "next-themes";

import NotificationDropdown from "../../components/notification/NotificationDropdown";
import ProfileDropdown from "../../components/user/ProfileDropdown";
import MobileMenu from "../../components/navbar/MobileMenu";

const UserNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useUser();
    const { theme, resolvedTheme, setTheme } = useTheme();

    const [mounted, setMounted] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoading] = useState(false);
    const [showNotifications, setShowNotif] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;
    const oneTapInit = useRef(false);
    const mobileSearchRef = useRef(null);
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    const handleSectionClick = id => {
        if (location.pathname !== "/") {
            navigate("/", { state: { scrollTo: id } });
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const toggleDarkMode = () => {
        setTheme(currentTheme === "dark" ? "light" : "dark");
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/");
    };

    const handleSearchKey = e => {
        if (e.key === "Enter" && searchKeyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
            setMobileMenuOpen(false);
            setShowMobileSearch(false);
        } else if (e.key === "Escape") {
            setShowMobileSearch(false);
        }
    };

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (user || token || oneTapInit.current || location.pathname === "/login") return;

        const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!CLIENT_ID || !window.google?.accounts?.id) return;

        oneTapInit.current = true;
        localStorage.setItem("redirectAfterLogin", location.pathname);

        window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: async res => {
                try {
                    const loginRes = await publicApi.post("/auth/login/google", { token: res.credential });
                    const { accessToken, refreshToken } = loginRes.data.data;

                    localStorage.setItem("token", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);

                    const userRes = await protectedApi.get("/user/me");
                    setUser(userRes.data);

                    const redirect = location.state?.from || localStorage.getItem("redirectAfterLogin") || "/";
                    localStorage.removeItem("redirectAfterLogin");
                    navigate(redirect);
                } catch (err) {
                    console.error("Google One-Tap login failed:", err);
                }
            },
            auto_select: true,
            cancel_on_tap_outside: false,
        });

        window.google.accounts.id.prompt();
    }, [user, location.pathname, navigate]);

    useEffect(() => {
        if (!user) return;
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await protectedApi.get("/notifications?role=USER");
                setNotifications(res.data.data || []);
            } catch (err) {
                console.error("Notification fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user]);

    useEffect(() => {
        const closeOnOutsideClick = e => {
            if (!e.target.closest(".profile-dropdown")) setDropdownOpen(false);
            if (!e.target.closest(".notification-dropdown")) setShowNotif(false);
            if (
                showMobileSearch &&
                !e.target.closest("#mobile-search-bar") &&
                !e.target.closest("#mobile-search-toggle")
            ) {
                setShowMobileSearch(false);
            }
        };
        document.addEventListener("click", closeOnOutsideClick);
        return () => document.removeEventListener("click", closeOnOutsideClick);
    }, [showMobileSearch]);

    useEffect(() => {
        if (showMobileSearch) mobileSearchRef.current?.focus();
    }, [showMobileSearch]);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    }, [mobileMenuOpen]);

    return (
        <div className="fixed top-0 left-0 w-full z-50">
            <nav
                className="px-4 sm:px-6 py-4 flex items-center justify-between backdrop-blur-md border-b"
                style={{
                    backgroundColor: "var(--navbar-bg)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                }}
            >
                {/* Left: Logo and Menu */}
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden -ml-1"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Open menu"
                        style={{ color: "var(--text-color)" }}
                    >
                        <Menu size={22} />
                    </button>
                    <img
                        src={currentTheme === "dark" ? logowhite : logoDark}
                        alt="Logo"
                        className="h-7 sm:h-8 w-auto cursor-pointer"
                        onClick={() => navigate("/")}
                    />
                </div>

                {/* Center: Navigation Links */}
                <ul className="hidden md:flex items-center gap-8 text-sm font-medium ml-[200px]">
                    {[
                        ["Home", "home"],
                        ["Projects", "projects"],
                        ["Services", "services"],
                        ["About Us", "about"],
                    ].map(([label, id]) => (
                        <li key={id}>
                            <a
                                className="whitespace-nowrap hover:text-blue-600 transition cursor-pointer"
                                onClick={() => handleSectionClick(id)}
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Right: Controls */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            onKeyDown={handleSearchKey}
                            placeholder="Search your project name"
                            className="rounded-full px-4 py-2 pl-10 w-[280px] text-sm focus:outline-none border shadow-sm"
                            style={{
                                backgroundColor: "var(--bg-color)",
                                color: "var(--text-secondary)",
                                borderColor: "var(--border-color)",
                            }}
                        />
                        <Search
                            size={16}
                            className="absolute left-3 top-2.5 pointer-events-none"
                            style={{ color: "var(--text-secondary)" }}
                        />
                    </div>

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-md border hover:shadow-sm transition"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            color: "var(--text-secondary)",
                            borderColor: "var(--border-color)",
                        }}
                        aria-label="Toggle theme"
                    >
                        {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {user && (
                        <Link
                            to="/my-orders"
                            className="hover:text-blue-600 transition"
                            style={{ color: "var(--text-secondary)" }}
                            aria-label="My orders"
                        >
                            <ShoppingCart size={18} />
                        </Link>
                    )}

                    {user && (
                        <NotificationDropdown
                            notifications={notifications}
                            setNotifications={setNotifications}
                            unreadCount={unreadCount}
                            loadingNotifications={loadingNotifications}
                            showNotifications={showNotifications}
                            setShowNotifications={setShowNotif}
                        />
                    )}

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
                                backgroundColor: "var(--button-primary,#2563eb)",
                                color: "#fff",
                            }}
                        >
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile: Bell + Search */}
                <div className="flex md:hidden items-center gap-4">
                    {user && (
                        <NotificationDropdown
                            notifications={notifications}
                            setNotifications={setNotifications}
                            unreadCount={unreadCount}
                            loadingNotifications={loadingNotifications}
                            showNotifications={showNotifications}
                            setShowNotifications={setShowNotif}
                        />
                    )}
                    <button
                        id="mobile-search-toggle"
                        onClick={() => setShowMobileSearch(s => !s)}
                        aria-label="Search"
                        style={{ color: "var(--text-color)" }}
                    >
                        <Search size={20} />
                    </button>
                </div>
            </nav>

            {showMobileSearch && (
                <div
                    id="mobile-search-bar"
                    className="md:hidden px-4 py-3 border-b"
                    style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                    }}
                >
                    <div className="relative">
                        <input
                            ref={mobileSearchRef}
                            type="text"
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            onKeyDown={handleSearchKey}
                            placeholder="Search projects..."
                            className="rounded-full px-4 py-2 pl-10 w-full text-sm focus:outline-none border shadow-sm"
                            style={{
                                backgroundColor: "var(--bg-color)",
                                color: "var(--text-secondary)",
                                borderColor: "var(--border-color)",
                            }}
                        />
                        <Search
                            size={16}
                            className="absolute left-3 top-2.5 pointer-events-none"
                            style={{ color: "var(--text-secondary)" }}
                        />
                    </div>
                </div>
            )}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                user={user}
                currentTheme={currentTheme}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
                handleSectionClick={handleSectionClick}
            />
        </div>
    );
};

export default UserNavbar;
