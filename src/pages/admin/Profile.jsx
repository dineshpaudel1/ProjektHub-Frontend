import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [admin, setAdmin] = useState(null);
    const [seller, setSeller] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchProfiles = async () => {
            try {
                const [adminRes, sellerRes] = await Promise.all([
                    axios.get("http://localhost:8080/api/admin/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:8080/api/seller/profile", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setAdmin(adminRes.data.data);
                setSeller(sellerRes.data.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch profile details.");
            }
        };

        fetchProfiles();
    }, []);

    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
    if (!admin || !seller) return <p className="text-center text-gray-500 mt-10">Loading profile...</p>;

    return (
        <div className="min-h-screen bg-white  px-4 pb-10">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Admin Profile Section */}
                <ProfileSection
                    title="Admin Profile"
                    user={admin}
                    joinedDate=""
                    roleField="role"
                    extraFields={{
                        username: admin.username,
                        email: admin.email,
                    }}
                />

                {/* Seller Profile Section */}
                <ProfileSection
                    title="Seller Profile"
                    user={{ fullName: seller.sellerName }}
                    joinedDate={seller.joinedAt}
                    roleField="status"
                    extraFields={{
                        phone: seller.phone || "919876543210",
                        bio: seller.bio || "",
                        location: seller.location || "Argentina",
                    }}
                />
            </div>
        </div>
    );
};

const ProfileSection = ({ title, user, joinedDate, roleField, extraFields }) => {
    return (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-2 overflow-hidden flex items-center justify-center">
                    <span className="text-xl text-gray-600 font-bold">
                        {user.fullName.split(" ").map(name => name[0]).join("").toUpperCase()}
                    </span>
                </div>
                <button className="text-blue-500 border border-blue-500 px-4 py-1 rounded-md text-sm hover:bg-blue-50 transition">
                    Upload Profile
                </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <ProfileInput label="First Name" value={user.fullName.split(' ')[0]} />
                <ProfileInput label="Last Name" value={user.fullName.split(' ')[1] || ''} />
                <ProfileInput label="Role / Status" value={user[roleField]} />
                <ProfileInput label="Joining Date" value={joinedDate ? new Date(joinedDate).toISOString().substring(0, 10) : ""} type="date" />

                {Object.entries(extraFields).map(([label, val]) => (
                    <ProfileInput key={label} label={label.replace(/^\w/, l => l.toUpperCase())} value={val} />
                ))}

                <ProfileInput label="Language" value="" isSelect />
                <ProfileInput label="Currency" value="" isSelect />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Write your objective"
                    defaultValue={extraFields.bio || ""}
                />
            </div>

            <div className="text-right">
                <button className="bg-[#5454D4] text-white px-6 py-2 rounded-md hover:bg-[#4343BB] transition">
                    Update Profile
                </button>
            </div>
        </div>
    );
};

const ProfileInput = ({ label, value, type = "text", isSelect = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {isSelect ? (
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Select</option>
            </select>
        ) : (
            <input
                type={type}
                defaultValue={value}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
        )}
    </div>
);

export default Profile;
