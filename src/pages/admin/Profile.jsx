import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get("http://localhost:8080/api/admin/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAdmin(response.data.data);

            } catch (err) {
                console.error(err);
                setError("Failed to fetch admin profile.");
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    if (!admin) {
        return <p className="text-center text-gray-500 mt-10">Loading profile...</p>;
    }

    return (
        <div className="min-h-screen bg-white pt-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800">Admin Profile</h2>
                        <p className="text-gray-500 text-sm mt-1">View and manage your account details</p>
                    </div>

                    {/* Profile Content */}
                    <div className="p-6">
                        <div className="flex items-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                <span className="text-2xl font-medium text-gray-600">
                                    {admin.fullName.split(' ').map(name => name[0]).join('').toUpperCase()}
                                </span>
                            </div>
                            <div className="ml-6">
                                <h3 className="text-xl font-medium text-gray-800">{admin.fullName}</h3>
                                <p className="text-gray-500">{admin.role}</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <ProfileRow label="Full Name" value={admin.fullName} />
                            <ProfileRow label="Username" value={admin.username} />
                            <ProfileRow label="Email" value={admin.email} />
                            <ProfileRow label="Role" value={admin.role} />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={() => navigate("/admin/profile/edit")}
                            className="px-4 py-2 bg-[#5454D4] text-white rounded-md hover:bg-[#4343BB] transition-colors"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <span className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">{label}</span>
        <span className="text-gray-800 font-medium">{value}</span>
    </div>
);

export default Profile;