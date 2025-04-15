import React, { useState, useRef, useEffect } from "react";
import user from "../assets/images/user.png"
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    // Close menu if clicked outside
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
        navigate("/login");
    };

    return (
        <header className="w-full px-6 py-4 bg-white border-b flex items-center justify-end relative">
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
                                    navigate("/profile");
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
