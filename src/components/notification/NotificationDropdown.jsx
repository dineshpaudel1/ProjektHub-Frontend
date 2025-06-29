// src/components/user/NotificationDropdown.jsx

import React from "react";
import { Bell } from "lucide-react";
import userphoto from "../../assets/images/user.png";
import { protectedApi } from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = ({
    notifications,
    setNotifications,
    unreadCount,
    loadingNotifications,
    showNotifications,
    setShowNotifications,
}) => {
    const navigate = useNavigate();

    const handleNotificationClick = async (note) => {
        try {
            await protectedApi.put(`/notifications/${note.id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === note.id ? { ...n, read: true } : n))
            );

            if (note.targetType === "ORDER") navigate(`/my-order/${note.targetId}`);
            else if (note.targetType === "PROJECT") navigate(`/project/${note.targetId}`);
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        } finally {
            setShowNotifications(false);
        }
    };

    return (
        <div className="relative notification-dropdown">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-md transition-all duration-300"
                style={{
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-secondary)",
                    borderColor: "var(--border-color)",
                }}
            >
                <Bell size={18} />
            </button>

            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 h-4 min-w-[1rem] flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}

            {showNotifications && (
                <div
                    className="absolute right-0 mt-2 w-72 max-h-[400px] overflow-y-auto rounded-md shadow-lg py-2 z-50 border"
                    style={{
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                        borderColor: "var(--border-color)",
                    }}
                >
                    {loadingNotifications ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                    ) : notifications.length > 0 ? (
                        notifications.map((note) => (
                            <div
                                key={note.id}
                                className="px-4 py-2 text-sm border-b flex items-start gap-2 cursor-pointer hover:brightness-95 transition-all duration-200"
                                style={{ borderColor: "var(--border-color)" }}
                                onClick={() => handleNotificationClick(note)}
                            >
                                <img
                                    src={
                                        note.photoUrl
                                            ? `${import.meta.env.VITE_API_URL}/media/photo?file=${note.photoUrl}`
                                            : userphoto
                                    }
                                    alt="notif"
                                    className="w-8 h-8 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{note.message}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(note.timeStamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No notifications</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
