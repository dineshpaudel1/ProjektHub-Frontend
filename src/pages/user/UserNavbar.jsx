
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Search, ShoppingCart, ChevronRight, ChevronDown } from "lucide-react";


import logowhite from "../../assets/images/logowhite.png";
import logoDark from "../../assets/images/logoblack.png";

import { useUser } from "../../context/UserContext";
import { protectedApi, publicApi } from "../../services/axiosInstance";
import { useTheme } from "next-themes";

import NotificationDropdown from "../../components/notification/NotificationDropdown";
import ProfileDropdown from "../../components/user/ProfileDropdown";

const UserNavbar = () => {
    /* ───────────────────── state / refs ───────────────────── */
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
    const [openSections, setOpenSections] = useState({
        goal: false,
        popular: false,
    });

    const handleSectionClick = id => {
        if (location.pathname !== "/") {
            navigate("/", { state: { scrollTo: id } });
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    /* avoid hydration mismatch for `next-themes` */
    useEffect(() => setMounted(true), []);
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    /* ───────────────────── helpers ───────────────────── */
    const toggleDarkMode = () =>
        setTheme(currentTheme === "dark" ? "light" : "dark");

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


    /* ───────────────────── effects ───────────────────── */

    /* Google One-Tap login */
    useEffect(() => {
        const access = localStorage.getItem("token");
        if (user || access || oneTapInit.current || location.pathname === "/login") return;

        const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!CLIENT_ID || !window.google?.accounts?.id) return;

        localStorage.setItem("redirectAfterLogin", location.pathname);
        oneTapInit.current = true;

        window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: async res => {
                try {
                    const idToken = res.credential;
                    const loginRes = await publicApi.post("/auth/login/google", { token: idToken });
                    const { accessToken, refreshToken } = loginRes.data.data;

                    localStorage.setItem("token", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);

                    const userRes = await protectedApi.get("/user/me");
                    setUser(userRes.data);

                    const redirect =
                        location.state?.from ||
                        localStorage.getItem("redirectAfterLogin") || "/";
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

    /* fetch notifications each login */
    useEffect(() => {
        if (!user) return;
        const getNotif = async () => {
            setLoading(true);
            try {
                const res = await protectedApi.get("/notifications?role=USER");
                setNotifications(res.data.data || []);
            } catch (e) {
                console.error("Fetch notifications failed:", e);
            } finally {
                setLoading(false);
            }
        };
        getNotif();
    }, [user]);

    /* close dropdown / search on click-outside */
    useEffect(() => {
        const handler = e => {
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
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [showMobileSearch]);

    /* focus mobile search */
    useEffect(() => {
        if (showMobileSearch) mobileSearchRef.current?.focus();
    }, [showMobileSearch]);

    /* lock scroll when drawer open */
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    }, [mobileMenuOpen]);


    /* ───────────────────── JSX ───────────────────── */
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
                {/* LEFT : burger + logo */}
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden -ml-1"
                        onClick={() => setMobileMenuOpen(true)}
                        style={{ color: "var(--text-color)" }}
                        aria-label="Open menu"
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

                {/* CENTER : links */}
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
                            >{label}</a>
                        </li>
                    ))}
                </ul>

                {/* RIGHT : desktop controls */}
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
                                caretColor: "var(--text-secondary)",
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
                            className="transition hover:text-blue-600"
                            style={{ color: "var(--text-secondary)" }}
                            aria-label="My orders"
                        ><ShoppingCart size={18} /></Link>
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
                        >Login</button>
                    )}
                </div>

                {/* mobile bell + search */}
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
                        style={{ color: "var(--text-color)" }}
                        aria-label="Search"
                    ><Search size={20} /></button>
                </div>
            </nav>

            {/* mobile inline search */}
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
                                caretColor: "var(--text-secondary)",
                            }}
                        />
                        <Search size={16}
                            className="absolute left-3 top-2.5 pointer-events-none"
                            style={{ color: "var(--text-secondary)" }} />
                    </div>
                </div>
            )}

            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 flex"
                    style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
                >
                    {/* sheet */}
                    <aside
                        className="w-[85%] max-w-xs h-full overflow-y-auto"
                        style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
                    >
                        {/* header with avatar + close */}
                        {/* HEADER inside the mobile drawer */}
                        <div
                            className="relative px-6 pr-14 py-5 border-b flex items-center justify-between"
                            /*            ^^^^^^^  ← add “relative” so the absolute-positioned X can anchor */
                            style={{ borderColor: "var(--border-color)" }}>

                            {/* left: avatar + greeting */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="cursor-pointer w-11 h-11 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={
                                            user?.profilePicture
                                                ? `${import.meta.env.VITE_API_URL}/media/photo?file=${user.profilePicture}`
                                                : "https://via.placeholder.com/100"
                                        }
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/100";
                                        }}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>

                                <div
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate(user ? "/userprofile" : "/login");
                                    }}
                                    className="flex flex-col text-sm leading-tight">
                                    <span className="font-medium">
                                        {user ? `Hi, ${user.fullName?.split(" ")[0]}` : "Welcome"}
                                    </span>
                                    <span
                                        className="text-[12px]"
                                        style={{ color: "var(--text-secondary)" }}>
                                        {user ? "Welcome back" : "Nice to see you"}
                                    </span>
                                </div>
                            </div>

                            {/* right: close button */}
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--hover-bg)]"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ color: "var(--text-color)" }}  /* ensure visible in both themes */
                                aria-label="Close menu">
                                <X size={20} />
                            </button>
                        </div>


                        {/* MAIN LIST */}
                        <nav className="pt-4">
                            <ul className="flex flex-col gap-3 px-6">
                                {[
                                    ["Home", "home"],
                                    ["Projects", "projects"],
                                    ["Services", "services"],
                                    ["About Us", "about"],
                                ].map(([label, id]) => (
                                    <li key={id}>
                                        <button
                                            onClick={() => {
                                                handleSectionClick(id);
                                                setMobileMenuOpen(false);
                                            }}
                                            className="block w-full text-left py-2 px-3 rounded
                                 font-medium whitespace-nowrap
                                 hover:bg-[var(--hover-bg)] transition">
                                            {label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <hr
                                className="my-5 mx-6 border-[var(--border-color)]"
                            />
                        </nav>
                        {/* footer */}
                        <div
                            className="px-6 py-6 space-y-4 border-t"
                            style={{ borderColor: "var(--border-color)" }}
                        >
                            <button
                                onClick={toggleDarkMode}
                                className="w-full flex items-center justify-center gap-2 border py-2 rounded-full font-medium"
                                style={{
                                    borderColor: "var(--border-color)",
                                    backgroundColor: "var(--hover-bg)",
                                }}
                            >
                                {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                                {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
                            </button>

                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-blue-600 text-white py-2 rounded-full font-medium"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate("/login");
                                    }}
                                    className="w-full bg-indigo-600 text-white py-2 rounded-full font-medium"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </aside>
                    {/* translucent backdrop click to close */}
                    <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
                </div>
            )}
        </div>
    );
};

export default UserNavbar;
