import React, { useEffect, useState, useRef } from "react";
import axios from "../../utils/axiosInstance";
import {
    User,
    MessageSquare,
    LayoutDashboard,
    HelpCircle,
    CreditCard,
    Settings,
    Lock,
    LogOut
} from "lucide-react";

const UserProfileDropdown = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const token = localStorage.getItem("accessToken");
    const dropdownRef = useRef();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get("/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading || !user) return null;

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <img
                src={user.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            />

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-xl z-50 text-sm">
                    <div className="p-4 border-b text-gray-600">
                        <p className="text-sm">Welcome <span className="font-semibold text-gray-800">{user.fullName?.split(" ")[0]}!</span></p>
                    </div>
                    <div className="py-2">
                        <MenuItem icon={<User size={16} />} label="Profile" />
                        <MenuItem icon={<MessageSquare size={16} />} label="Messages" />
                        <MenuItem icon={<LayoutDashboard size={16} />} label="Taskboard" />
                        <MenuItem icon={<HelpCircle size={16} />} label="Help" />
                        <div className="px-4 py-2 border-t">
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <CreditCard size={16} /> Balance: <span className="font-bold text-gray-800 ml-1">$5971.67</span>
                            </p>
                        </div>
                        <MenuItem icon={<Settings size={16} />} label="Settings" badge="New" />
                        <MenuItem icon={<Lock size={16} />} label="Lock Screen" />
                        <MenuItem icon={<LogOut size={16} />} label="Log Out" />
                    </div>
                </div>
            )}
        </div>
    );
};

const MenuItem = ({ icon, label, badge }) => (
    <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
        <div className="flex items-center space-x-2 text-gray-700">
            {icon}
            <span>{label}</span>
        </div>
        {badge && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">
                {badge}
            </span>
        )}
    </div>
);

export default UserProfileDropdown;
