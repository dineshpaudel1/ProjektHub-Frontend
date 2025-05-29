import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, ShoppingCart } from "lucide-react";
import logowhite from "../../assets/images/logowhite.png";
import logoDark from "../../assets/images/logoblack.png";
import { useUser } from "../../context/UserContext";
import SellerRegisterModal from "../../modals/SellerRegisterModal";

const UserNavbar = () => {
    const navigate = useNavigate();
    const { user, setUser, roles } = useUser();

    const getInitialTheme = () =>
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(getInitialTheme);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSellerModal, setShowSellerModal] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleDarkMode = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    useEffect(() => {
        const handleScrollClose = () => setIsOpen(false);
        window.addEventListener("scroll", handleScrollClose);
        return () => window.removeEventListener("scroll", handleScrollClose);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".profile-dropdown")) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setDropdownOpen(false);
        navigate("/login");
    };

    useEffect(() => {
        document.body.style.overflow = showSellerModal ? 'hidden' : 'auto';
    }, [showSellerModal]);


    const isSeller = roles?.includes("SELLER");
    return (
        <div className="fixed top-0 left-0 w-full z-50 ">
            <nav
                className="px-6 py-4 flex justify-between items-center font-sans backdrop-blur-md border-b"
                style={{
                    color: "var(--text-color)",
                    backgroundColor:
                        theme === "dark" ? "rgba(25, 25, 27, 0.3)" : "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderColor: "var(--border-color)",
                    boxShadow:
                        theme === "dark"
                            ? "0 4px 30px rgba(0, 0, 0, 0.4)"
                            : "0 4px 30px rgba(0, 0, 0, 0.05)",
                }}
            >
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
                    <img
                        src={theme === "dark" ? logowhite : logoDark}
                        alt="Logo"
                        className="h-8 w-auto"
                    />
                </div>

                <div className="hidden md:flex space-x-10">
                    <a onClick={() => navigate("/")} className="font-semibold hover:text-indigo-500 transition">
                        Home
                    </a>
                    <a onClick={() => navigate("/projects")} className="font-semibold hover:text-indigo-500 transition">
                        Projects
                    </a>
                    <a onClick={() => navigate("/services")} className="font-semibold hover:text-indigo-500 transition">
                        Our Services
                    </a>
                    <a onClick={() => navigate("/about")} className="font-semibold hover:text-indigo-500 transition">
                        About Us
                    </a>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full transition"
                        style={{ backgroundColor: "var(--hover-bg)" }}
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* {user && !isSeller && (
                        <a onClick={() => setShowSellerModal(true)} className="font-semibold hover:text-indigo-500 transition cursor-pointer">
                            Become Seller
                        </a>
                    )} */}

                    {user && (
                        <Link
                            to="/my-orders"
                            className="font-semibold hover:text-indigo-500 transition cursor-pointer"
                        >
                            <ShoppingCart />
                        </Link>
                    )}


                    {user ? (
                        <div className="relative profile-dropdown">
                            <div
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer border border-gray-400"
                            >
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold text-white bg-indigo-600 w-full h-full flex items-center justify-center rounded-full">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {dropdownOpen && (
                                <div
                                    className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 z-50 border ${theme === "dark"
                                        ? "bg-gray-900 text-white border-gray-700"
                                        : "bg-white text-gray-800 border-gray-200"
                                        }`}
                                >
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            navigate("/userprofile");
                                        }}
                                        className={`w-full px-4 py-2 text-sm text-left transition ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                                            }`}
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className={`w-full px-4 py-2 text-sm text-left transition text-red-600 ${theme === "dark" ? "hover:bg-red-700" : "hover:bg-red-100"
                                            }`}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-indigo-600 text-white font-medium rounded-full px-5 py-2 hover:bg-indigo-700 transition"
                        >
                            Login
                        </button>
                    )}
                </div>

                <div className="md:hidden z-30">
                    <button onClick={() => setIsOpen(!isOpen)} style={{ color: "var(--text-color)" }}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 overflow-y-auto"
                    style={{
                        backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
                        color: theme === "dark" ? "#ffffff" : "#111827",
                        transition: "all 0.3s ease",
                    }}
                >
                    {/* Top bar with profile and close */}
                    {/* TOP MOBILE NAV HEADER */}
                    <div className="flex items-center justify-between px-6 py-4 border-b"
                        style={{
                            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                        }}
                    >
                        {/* Left: Logo */}
                        <div className="flex items-center gap-3">
                            <img
                                src={theme === "dark" ? logowhite : logoDark}
                                alt="Logo"
                                className="h-6 sm:h-7"
                            />

                            {/* Show only if user is logged in */}

                        </div>

                        {/* Right: Close Button */}
                        <button onClick={() => setIsOpen(false)} className="text-xl">
                            <X size={24} />
                        </button>
                    </div>


                    {/* Nav Items */}
                    <ul className="px-6 py-6 space-y-6 text-lg font-medium">
                        <li>
                            {user && (
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-400 bg-gray-300">
                                        {user.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt="Profile"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white bg-indigo-600 rounded-full font-semibold">
                                                {user.username?.charAt(0).toUpperCase() || "A"}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            navigate("/userprofile");
                                        }}
                                        className="font-medium hover:underline text-[var(--primary-color)]"
                                    >
                                        {user.username}
                                    </button>
                                </div>
                            )}
                        </li>
                        <li>
                            <a
                                href="#projects"
                                onClick={() => setIsOpen(false)}
                                className="block hover:text-indigo-500"
                            >
                                Projects
                            </a>
                        </li>
                        <li>
                            <a
                                href="#services"
                                onClick={() => setIsOpen(false)}
                                className="block hover:text-indigo-500"
                            >
                                Our Services
                            </a>
                        </li>
                        <li>
                            <a
                                href="#about"
                                onClick={() => setIsOpen(false)}
                                className="block hover:text-indigo-500"
                            >
                                About Us
                            </a>
                        </li>
                    </ul>

                    {/* Bottom: Theme + Login/Logout */}
                    <div className="px-6 space-y-4 pb-8">
                        <button
                            onClick={toggleDarkMode}
                            className="w-full flex items-center justify-center gap-2 border py-2 rounded-full font-medium"
                            style={{
                                borderColor: theme === "dark" ? "#4b5563" : "#d1d5db",
                                backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb",
                            }}
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </button>

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-600 text-white py-2 rounded-full font-medium"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate("/login");
                                }}
                                className="w-full bg-indigo-600 text-white py-2 rounded-full font-medium"
                            >
                                Login
                            </button>
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
