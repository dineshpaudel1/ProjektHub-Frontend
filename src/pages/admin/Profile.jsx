import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { User, Mail, Briefcase, Calendar, Edit2, Camera, Shield, CheckCircle, Clock, AlertCircle, Loader, Save, X } from 'lucide-react';

const Profile = () => {
    const [activeTab, setActiveTab] = useState("admin");
    const [admin, setAdmin] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Authentication required");
            setLoading(false);
            return;
        }

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
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch profile details.");
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    const handleProfileUpdate = async (type) => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            setNotification({
                type: "success",
                message: `${type === 'admin' ? 'Admin' : 'Seller'} profile updated successfully!`
            });

            // Auto-dismiss notification after 5 seconds
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }, 1500);
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (event) => {
            if (type === 'admin') {
                setAdmin(prev => ({ ...prev, profileImage: event.target.result }));
            } else {
                setSeller(prev => ({ ...prev, profilePicture: file.name }));
            }
        };
        reader.readAsDataURL(file);

        // Simulate upload
        setNotification({
            type: "info",
            message: "Uploading profile image..."
        });

        setTimeout(() => {
            setNotification({
                type: "success",
                message: "Profile image updated successfully!"
            });

            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-700">Loading profiles...</h2>
                    <p className="text-gray-500 mt-2">Please wait while we fetch your information</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Notification */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-lg flex items-start justify-between ${notification.type === 'success' ? 'bg-green-50 text-green-800' :
                        notification.type === 'error' ? 'bg-red-50 text-red-800' :
                            'bg-blue-50 text-blue-800'
                        }`}>
                        <div className="flex items-center">
                            {notification.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                            {notification.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
                            {notification.type === 'info' && <Clock className="w-5 h-5 mr-2" />}
                            <p>{notification.message}</p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
                </div>

                {/* Profile Tabs */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                    <div className="flex border-b">
                        <button
                            className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === 'admin'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('admin')}
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Admin Profile
                        </button>
                        <button
                            className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === 'seller'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('seller')}
                        >
                            <Briefcase className="w-4 h-4 mr-2" />
                            Seller Profile
                        </button>
                    </div>

                    {/* Admin Profile */}
                    {activeTab === 'admin' && admin && (
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Profile Image Column */}
                                <div className="md:w-1/3">
                                    <div className="flex flex-col items-center">
                                        <div className="relative group mb-4">
                                            {admin.profileImage ? (
                                                <img
                                                    src={admin.profileImage || "/placeholder.svg"}
                                                    alt="Profile"
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                                                    {admin.fullName?.split(" ").map(n => n[0]).join("")}
                                                </div>
                                            )}
                                            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition-colors">
                                                <Camera className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, 'admin')}
                                                />
                                                <span className="sr-only">Upload profile picture</span>
                                            </label>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{admin.fullName}</h3>
                                        <div className="flex items-center mt-1 text-sm text-gray-600">
                                            <Shield className="w-4 h-4 mr-1" />
                                            <span>{admin.roles?.join(', ') || 'Administrator'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Column */}
                                <div className="md:w-2/3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ProfileField
                                            label="Full Name"
                                            value={admin.fullName}
                                            icon={<User className="w-4 h-4 text-gray-500" />}
                                        />
                                        <ProfileField
                                            label="Username"
                                            value={admin.username}
                                            icon={<User className="w-4 h-4 text-gray-500" />}
                                        />
                                        <ProfileField
                                            label="Email"
                                            value={admin.email}
                                            icon={<Mail className="w-4 h-4 text-gray-500" />}
                                            type="email"
                                        />
                                        <ProfileField
                                            label="Role"
                                            value={admin.roles?.join(', ')}
                                            icon={<Shield className="w-4 h-4 text-gray-500" />}
                                            disabled
                                        />
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button
                                            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mr-3"
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                            onClick={() => handleProfileUpdate('admin')}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Seller Profile */}
                    {activeTab === 'seller' && seller && (
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Profile Image Column */}
                                <div className="md:w-1/3">
                                    <div className="flex flex-col items-center">
                                        <div className="relative group mb-4">
                                            {seller.profilePicture ? (
                                                <img
                                                    src={`http://localhost:8080/api/media/photo?file=${seller.profilePicture}`}
                                                    alt="Profile"
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                                                    {seller.sellerName?.split(" ").map(n => n[0]).join("")}
                                                </div>
                                            )}
                                            <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-green-700 transition-colors">
                                                <Camera className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, 'seller')}
                                                />
                                                <span className="sr-only">Upload profile picture</span>
                                            </label>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{seller.sellerName}</h3>
                                        <div className="flex items-center mt-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${seller.status === 'active' ? 'bg-green-100 text-green-800' :
                                                seller.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {seller.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {seller.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                                {seller.status || 'Unknown'}
                                            </span>
                                        </div>
                                        {seller.joinedAt && (
                                            <div className="flex items-center mt-3 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                <span>Joined {new Date(seller.joinedAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form Column */}
                                <div className="md:w-2/3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ProfileField
                                            label="Seller Name"
                                            value={seller.sellerName}
                                            icon={<User className="w-4 h-4 text-gray-500" />}
                                        />
                                        <ProfileField
                                            label="Status"
                                            value={seller.status}
                                            icon={<CheckCircle className="w-4 h-4 text-gray-500" />}
                                            disabled
                                        />
                                        <div className="md:col-span-2">
                                            <ProfileField
                                                label="Bio"
                                                value={seller.bio}
                                                icon={<Edit2 className="w-4 h-4 text-gray-500" />}
                                                multiline
                                            />
                                        </div>
                                        {seller.joinedAt && (
                                            <ProfileField
                                                label="Joined Date"
                                                value={new Date(seller.joinedAt).toISOString().substring(0, 10)}
                                                icon={<Calendar className="w-4 h-4 text-gray-500" />}
                                                type="date"
                                                disabled
                                            />
                                        )}
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button
                                            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mr-3"
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                            onClick={() => handleProfileUpdate('seller')}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfileField = ({ label, value, icon, type = "text", multiline = false, disabled = false }) => (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {icon}
            </div>
            {multiline ? (
                <textarea
                    defaultValue={value || ''}
                    rows={4}
                    disabled={disabled}
                    className={`w-full border border-gray-300 rounded-lg pl-10 py-2 pr-3 text-gray-900 ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        } transition-all duration-200`}
                />
            ) : (
                <input
                    type={type}
                    defaultValue={value || ''}
                    disabled={disabled}
                    className={`w-full border border-gray-300 rounded-lg pl-10 py-2 pr-3 text-gray-900 ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        } transition-all duration-200`}
                />
            )}
        </div>
    </div>
);

export default Profile;