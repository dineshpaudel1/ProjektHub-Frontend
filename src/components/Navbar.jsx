import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import user from "../assets/images/user.png";
import logo from "../assets/images/logoblack.png"; // ✅ update with your logo

const Navbar = ({ toggleSidebar }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        navigate("/admin/login");
    };

    return (
        <header
            className="fixed top-0 left-0 w-full h-[60px] z-50 bg-white flex items-center justify-between px-6"
            style={{ borderBottom: "1px solid #6a6a6a" }}
        >            {/* Left: Toggle + Logo */}
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar}>
                    <Menu size={22} className="text-black" />
                </button>
                <img src={logo} alt="Logo" className="h-7 sm:h-8 object-contain" />
            </div>

            {/* Right: Notifications + User Avatar */}
            <div className="flex items-center gap-6">
                <Bell className="w-5 h-5 text-black" />

                <div className="relative" ref={menuRef}>
                    <img
                        src={user}
                        alt="User"
                        onClick={() => setShowMenu(!showMenu)}
                        className="w-8 h-8 rounded-full object-cover border cursor-pointer"
                    />

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md py-2 z-50">
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                    setShowMenu(false);
                                    navigate("profile");
                                }}
                            >
                                Profile
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
