import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { protectedApi } from "../../services/axiosInstance";
import { Loader, Mail, User } from "lucide-react";

const UserProfile = () => {
    const { user } = useUser();
    const [newPassword, setNewPassword] = useState("");
    const [notification, setNotification] = useState(null);

    const handleSetPassword = async () => {
        if (!newPassword) return;
        try {
            await protectedApi.post("/user/set-password", { newPassword });
            setNotification({ type: "success", message: "Password updated successfully!" });
            setNewPassword("");
        } catch (error) {
            console.error("Error setting password:", error);
            setNotification({ type: "error", message: "Failed to update password." });
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex justify-center items-center px-4" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
            <div className="w-full max-w-xl rounded-xl shadow-lg p-8 border" style={{ backgroundColor: "var(--menu-bg)", borderColor: "var(--border-color)" }}>
                <div className="space-y-6">
                    <div className="flex flex-col items-center">
                        <img
                            src={user.profilePicture ? `http://localhost:8080/api/media/photo?file=${user.profilePicture}` : "https://via.placeholder.com/150"}
                            alt="Profile"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150" }}
                            className="w-32 h-32 rounded-full border border-green-500 object-cover"
                        />
                        <h2 className="text-xl font-semibold mt-3">{user.fullName}</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <div className="flex items-center gap-2 px-4 py-2 border rounded-md" style={{ backgroundColor: "var(--bg-color)", borderColor: "var(--border-color)" }}>
                            <User size={18} />
                            <span>{user.username}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <div className="flex items-center gap-2 px-4 py-2 border rounded-md" style={{ backgroundColor: "var(--bg-color)", borderColor: "var(--border-color)" }}>
                            <Mail size={18} />
                            <span>{user.email}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Set New Password</label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="flex-1 px-4 py-2 border rounded-md focus:outline-none"
                                style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)", borderColor: "var(--border-color)" }}
                            />
                            <button
                                onClick={handleSetPassword}
                                className="px-6 py-2 rounded-md text-white transition"
                                style={{ backgroundColor: "var(--button-primary)" }}
                            >
                                Save Password
                            </button>
                        </div>

                        {notification && (
                            <div className={`mt-3 px-4 py-2 rounded text-sm ${notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {notification.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
