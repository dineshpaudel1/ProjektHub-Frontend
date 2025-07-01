import React from "react";
import { X, Sun, Moon } from "lucide-react";

const menuItems = [
    ["Home", "home"],
    ["Projects", "projects"],
    ["Services", "services"],
    ["About Us", "about"],
];

const MobileMenu = ({
    user,
    currentTheme,
    toggleDarkMode,
    handleLogout,
    handleSectionClick,
    navigate,
    setMobileMenuOpen,
}) => (
    <div className="md:hidden fixed inset-0 z-40 flex"
        style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
        <aside className="w-[85%] max-w-xs h-full overflow-y-auto"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
            {/* header */}
            <div className="relative px-6 py-5 border-b flex items-center gap-4"
                style={{ borderColor: "var(--border-color)" }}>
                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setMobileMenuOpen(false)}
                ><X size={20} /></button>

                <div
                    className="cursor-pointer flex-shrink-0 w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold uppercase"
                    onClick={() => {
                        setMobileMenuOpen(false);
                        navigate(user ? "/userprofile" : "/login");
                    }}>
                    {user ? (user.name?.slice(0, 2) || "U") : "U"}
                </div>

                <div className="flex flex-col text-sm leading-tight">
                    <span className="font-medium">
                        {user ? `Hi, ${user.fullName?.split(" ")[0]}` : "Welcome"}
                    </span>
                    <span className="text-[12px]"
                        style={{ color: "var(--text-secondary)" }}>
                        {user ? "Welcome back" : "Nice to see you"}
                    </span>
                </div>
            </div>

            {/* links */}
            <nav className="text-sm">
                {menuItems.map(([label, id]) => (
                    <button
                        key={id}
                        onClick={() => {
                            handleSectionClick(id);
                            setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-6 py-3 hover:bg-[var(--hover-bg)] transition whitespace-nowrap"
                    >{label}</button>
                ))}
            </nav>

            {/* footer */}
            <div className="px-6 py-6 space-y-4 border-t"
                style={{ borderColor: "var(--border-color)" }}>
                <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-center gap-2 border py-2 rounded-full font-medium"
                    style={{
                        borderColor: "var(--border-color)",
                        backgroundColor: "var(--hover-bg)"
                    }}>
                    {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>

                {user ? (
                    <button
                        onClick={handleLogout}
                        className="w-full bg-blue-600 text-white py-2 rounded-full font-medium"
                    >Logout</button>
                ) : (
                    <button
                        onClick={() => {
                            setMobileMenuOpen(false);
                            navigate("/login");
                        }}
                        className="w-full bg-indigo-600 text-white py-2 rounded-full font-medium"
                    >Login</button>
                )}
            </div>
        </aside>
        <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
    </div>
);

export default MobileMenu;
