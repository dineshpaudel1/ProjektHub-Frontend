import React, { useState, useEffect } from "react";
import logowhite from "../assets/images/logowhite.png";
import logoDark from "../assets/images/logoblack.png";
import { useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";

const UserNavbar = () => {
    const navigate = useNavigate();
    const getInitialTheme = () =>
        localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(getInitialTheme);

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

    return (
        <div className="fixed top-0 left-0 w-full z-50">
            <nav
                className="px-6 py-4 flex justify-between items-center font-sans backdrop-blur-md border-b"
                style={{
                    color: "var(--text-color)",
                    backgroundColor: theme === "dark"
                        ? "rgba(25, 25, 27, 0.3)"
                        : "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderColor: "var(--border-color)",
                    boxShadow: theme === "dark"
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
                    <a href="#home" onClick={() => navigate("/")} className="font-semibold hover:text-indigo-500 transition">
                        Home
                    </a>
                    <a href="#projects" className="font-semibold hover:text-indigo-500 transition">
                        Projects
                    </a>
                    <a href="#services" className="font-semibold hover:text-indigo-500 transition">
                        Our Services
                    </a>
                    <a href="#about" className="font-semibold hover:text-indigo-500 transition">
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
                    <button
                        onClick={() => navigate("login")}
                        className="bg-indigo-600 text-white font-medium rounded-full px-5 py-2 hover:bg-indigo-700 transition"
                    >
                        Login
                    </button>
                </div>

                <div className="md:hidden z-30">
                    <button onClick={() => setIsOpen(!isOpen)} style={{ color: "var(--text-color)" }}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {isOpen && (
                <div
                    className="md:hidden absolute top-full left-0 w-full px-6 py-4 space-y-4 z-20 shadow-lg"
                    style={{
                        backgroundColor: "var(--menu-bg)",
                        color: "var(--text-color)",
                        borderTop: "1px solid var(--border-color)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)"
                    }}
                >
                    <a onClick={() => setIsOpen(false)} className="block font-semibold hover:text-indigo-500" href="#home">
                        Home
                    </a>
                    <a onClick={() => setIsOpen(false)} className="block font-semibold hover:text-indigo-500" href="#projects">
                        Projects
                    </a>
                    <a onClick={() => setIsOpen(false)} className="block font-semibold hover:text-indigo-500" href="#services">
                        Our Services
                    </a>
                    <a onClick={() => setIsOpen(false)} className="block font-semibold hover:text-indigo-500" href="#about">
                        About Us
                    </a>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate("login");
                        }}
                        className="w-full bg-indigo-600 text-white py-2 rounded-full font-semibold"
                    >
                        Login
                    </button>

                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-center gap-2 border py-2 rounded-full font-medium mt-2"
                        style={{ borderColor: "var(--border-color)" }}
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserNavbar;
