// components/navbar/MobileMenu.jsx
import { X, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileMenu = ({
    isOpen,
    onClose,
    user,
    currentTheme,
    toggleDarkMode,
    handleLogout,
    handleSectionClick,
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null; // nothing to paint

    return (
        <div
            className="md:hidden fixed inset-0 z-40 flex"
            style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
        >
            {/* ───────── drawer ───────── */}
            <aside
                className="w-[85%] max-w-xs h-full overflow-y-auto"
                style={{
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                }}
            >
                {/* ───── header ───── */}
                <div
                    className="relative px-6 pr-14 py-5 border-b flex items-center gap-4"
                    style={{ borderColor: "var(--border-color)" }}
                >
                    {/* avatar */}
                    <div
                        className="cursor-pointer w-11 h-11 rounded-full bg-gray-400 overflow-hidden flex-shrink-0"
                        onClick={() => {
                            onClose();
                            navigate(user ? "/userprofile" : "/login");
                        }}
                    >
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

                    {/* greeting */}
                    <div className="flex flex-col text-sm leading-tight">
                        <span className="font-medium">
                            {user ? `Hi, ${user.fullName?.split(" ")[0]}` : "Welcome"}
                        </span>
                        <span
                            className="text-[12px]"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {user ? "Welcome back" : "Nice to see you"}
                        </span>
                    </div>

                    {/* close button */}
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--hover-bg)]"
                        onClick={onClose}
                        style={{ color: "var(--text-color)" }}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ───── nav links ───── */}
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
                                        onClose();
                                    }}
                                    className="block w-full text-left py-2 px-3 rounded font-medium hover:bg-[var(--hover-bg)] transition"
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <hr className="my-5 mx-6 border-[var(--border-color)]" />
                </nav>

                {/* ───── footer actions ───── */}
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
                                onClose();
                                navigate("/login");
                            }}
                            className="w-full bg-indigo-600 text-white py-2 rounded-full font-medium"
                        >
                            Login
                        </button>
                    )}
                </div>
            </aside>

            {/* click-away transparent area */}
            <div className="flex-1" onClick={onClose} />
        </div>
    );
};

export default MobileMenu;
