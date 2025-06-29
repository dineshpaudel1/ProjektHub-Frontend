// src/components/user/ProfileDropdown.jsx
import React from "react";
import {
    User,
    Mail,
    ClipboardList,
    Settings as Cog,
    Headphones,
    LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ user, dropdownOpen, setDropdownOpen, handleLogout }) => {
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <div className="relative profile-dropdown">
            <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden cursor-pointer border"
                style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                }}
            >
                {user.profilePicture ? (
                    <img
                        src={`${import.meta.env.VITE_API_URL}/media/photo?file=${user.profilePicture}`}
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
                    className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-50 border overflow-hidden"
                    style={{
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                        borderColor: "var(--border-color)",
                    }}
                >
                    {[
                        { label: "Profile", icon: User, action: () => navigate("/userprofile") },
                        {
                            label: "Inbox",
                            icon: Mail,
                            action: () => window.open("https://wa.me/9847503434", "_blank"),
                        },
                        {
                            label: "Settings",
                            icon: Cog,
                            action: () => navigate("/userprofile"),
                        },
                        {
                            label: "Support",
                            icon: Headphones,
                            action: () => window.open("https://wa.me/9847503434", "_blank"),
                        },
                        { label: "Log Out", icon: LogOut, action: handleLogout, danger: true },
                    ].map(({ label, icon: Icon, action, danger }, idx, arr) => (
                        <button
                            key={label}
                            onClick={() => {
                                setDropdownOpen(false);
                                action();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition
      ${danger ? "text-red-600" : ""}
      hover:bg-[var(--hover-bg)]`}
                            style={{
                                borderBottom:
                                    idx !== arr.length - 1 ? `1px solid var(--border-color)` : "none",
                            }}
                        >
                            <Icon size={18} className="shrink-0" />
                            <span className="whitespace-nowrap">{label}</span>
                        </button>
                    ))}

                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
