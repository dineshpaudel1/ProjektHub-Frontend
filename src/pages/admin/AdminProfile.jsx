import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import ProfileField from "../../components/ProfileField";
import {
    User, Mail, Shield, Camera, CheckCircle,
    AlertCircle, Clock, Loader, Save, X
} from "lucide-react";

const AdminProfile = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Authentication required");
            setLoading(false);
            return;
        }

        axios.get("http://localhost:8080/api/admin/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                setAdmin(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to fetch admin profile.");
                setLoading(false);
            });
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setAdmin(prev => ({ ...prev, profileImage: event.target.result }));
        };
        reader.readAsDataURL(file);
        setNotification({ type: "info", message: "Uploading profile image..." });

        setTimeout(() => {
            setNotification({ type: "success", message: "Profile image updated!" });
            setTimeout(() => setNotification(null), 3000);
        }, 2000);
    };

    const handleProfileUpdate = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setNotification({ type: "success", message: "Profile updated successfully!" });
            setTimeout(() => setNotification(null), 3000);
        }, 1500);
    };

    if (loading) return <LoadingView message="Loading admin profile..." />;
    if (error) return <ErrorView message={error} />;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 max-w-4xl mx-auto">
            {notification && <NotificationBanner {...notification} onClose={() => setNotification(null)} />}

            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Profile</h1>

            <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-xl shadow-sm">
                {/* Image */}
                <div className="md:w-1/3 flex flex-col items-center">
                    <div className="relative group mb-4">
                        {admin.profileImage ? (
                            <img src={admin.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white" />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                                {admin.fullName?.split(" ").map(n => n[0]).join("")}
                            </div>
                        )}
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition-colors">
                            <Camera className="w-4 h-4" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                    <h3 className="text-lg font-semibold">{admin.fullName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{admin.roles?.join(', ')}</p>
                </div>

                {/* Fields */}
                <div className="md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileField label="Full Name" value={admin.fullName} icon={<User />} />
                        <ProfileField label="Username" value={admin.username} icon={<User />} />
                        <ProfileField label="Email" value={admin.email} icon={<Mail />} />
                        <ProfileField label="Role" value={admin.roles?.join(', ')} icon={<Shield />} disabled />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button onClick={handleProfileUpdate} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                            {saving ? <><Loader className="w-4 h-4 animate-spin mr-2" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationBanner = ({ type, message, onClose }) => (
    <div className={`mb-6 p-4 rounded-lg flex justify-between items-center ${type === 'success' ? 'bg-green-50 text-green-800' : type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
        <div className="flex items-center gap-2">
            {type === 'success' && <CheckCircle className="w-5 h-5" />}
            {type === 'error' && <AlertCircle className="w-5 h-5" />}
            {type === 'info' && <Clock className="w-5 h-5" />}
            <span>{message}</span>
        </div>
        <button onClick={onClose}><X className="w-4 h-4" /></button>
    </div>
);

const LoadingView = ({ message }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700">{message}</h2>
        </div>
    </div>
);

const ErrorView = ({ message }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{message}</p>
        </div>
    </div>
);

export default AdminProfile;
