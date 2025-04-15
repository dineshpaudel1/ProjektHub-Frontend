import React, { useState } from "react";
import logo from "../assets/images/logowhite.png";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const UserNavbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = ["Home", "Projects", "Our Services", "About Us"];

    return (
        <div className="relative z-20">
            {/* Gradient Blurs */}
            <div className="absolute top-0 left-0 w-[90%] h-[80%] z-0">
                <div className="w-full h-full blur-[350px]"
                    style={{
                        background: "linear-gradient(to bottom, #5454D4 20%, #5454D4 10%)",
                    }} />
            </div>
            <div className="absolute top-0 right-10 w-[90%] h-[60%] z-0">
                <div className="w-full h-full blur-[350px]"
                    style={{
                        background: "linear-gradient(to bottom, #FF4500 10%, #B043FF 10%)",
                    }} />
            </div>

            {/* Navbar */}
            <nav className="relative bg-transparent px-6 py-4 flex justify-between items-center w-full font-sans">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="Logo" className="h-8 w-auto" />
                </div>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex space-x-12">
                    {navLinks.map((item, i) => (
                        <a
                            key={i}
                            href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                            className={`text-white font-semibold hover:text-[#5454D4] transition ${item === "Home" ? "text-[#5454D4]" : ""
                                }`}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Login Button (always visible) */}
                <div className="hidden md:block">
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-[#5454D4] text-white font-medium rounded-full"
                        style={{ width: "120px", height: "40px" }}
                    >
                        Login
                    </button>
                </div>

                {/* Hamburger Menu (Mobile) */}
                <div className="md:hidden z-30">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="text-white" /> : <Menu className="text-white" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#19191B] px-6 py-4 space-y-4">
                    {navLinks.map((item, i) => (
                        <a
                            key={i}
                            href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                            className="block text-white font-semibold hover:text-[#5454D4]"
                            onClick={() => setIsOpen(false)}
                        >
                            {item}
                        </a>
                    ))}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate("/login");
                        }}
                        className="w-full bg-[#5454D4] text-white py-2 rounded-full font-semibold mt-2"
                    >
                        Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserNavbar;
