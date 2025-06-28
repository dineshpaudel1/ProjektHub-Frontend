import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { protectedApi } from "../../services/axiosInstance";
import ProfileField from "../../components/user/ProfileField";
import {
  User, Camera, Calendar, Edit2,
  Clock, CheckCircle, AlertCircle,
  Loader, Save, X, Phone, Mail
} from "lucide-react";

const Api = import.meta.env.VITE_API_URL;

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    protectedApi.get("/seller/profile")
      .then(res => {
        setSeller(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch seller profile.");
        setLoading(false);
      });
  }, []);

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setNotification({ type: "info", message: "Uploading profile photo..." });

    try {
      const res = await protectedApi.put("/seller/profile-picture", formData);

      const uploadedPath =
        res.data?.data?.fileName ||
        res.data?.data?.path ||
        res.data?.fileName ||
        res.data?.path ||
        file.name;

      const separator = uploadedPath.includes("?") ? "&" : "?";
      const timestampedPath = `${uploadedPath}${separator}t=${Date.now()}`;

      setSeller(prev => ({
        ...prev,
        profilePicture: timestampedPath,
      }));

      setNotification({ type: "success", message: "Profile photo updated!" });
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Upload failed!" });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleProfileUpdate = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setNotification({ type: "success", message: "Profile updated successfully!" });
      setTimeout(() => setNotification(null), 3000);
    }, 1500);
  };

  if (loading) return <LoadingView message="Loading seller profile..." />;
  if (error) return <ErrorView message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 max-w-4xl mx-auto">
      {notification && (
        <NotificationBanner {...notification} onClose={() => setNotification(null)} />
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Seller Profile</h1>

      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="relative mb-4">
            {seller.profilePicture ? (
              <>
                <img
                  src={`${Api}/media/photo?file=${seller.profilePicture}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                <label
                  className="absolute bottom-5 right-3 bg-green-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-green-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicUpload}
                  />
                </label>
              </>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                {seller.sellerName?.split(" ").map(n => n[0]).join("")}
              </div>
            )}
            <span className="block text-center text-sm mt-1">Profile Photo</span>
          </div>

          <div className="mb-4">
            {seller.verificationPhotoPath ? (
              <img
                src={`${Api}/media/photo?file=${seller.verificationPhotoPath}`}
                alt="Verification"
                onError={(e) => (e.target.src = "/no-verification.png")}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                {seller.sellerName?.split(" ").map(n => n[0]).join("")}
              </div>
            )}
            <span className="block text-center text-sm mt-1">Verification Photo</span>
          </div>

          <h3 className="text-lg font-semibold">{seller.sellerName}</h3>
          <p className="text-sm text-gray-600 mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${seller.status === "APPROVED"
              ? "bg-green-100 text-green-800"
              : seller.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
              }`}>
              {seller.status === "APPROVED" && <CheckCircle className="w-3 h-3 mr-1" />}
              {seller.status === "PENDING" && <Clock className="w-3 h-3 mr-1" />}
              {seller.status || "Unknown"}
            </span>
          </p>
          {seller.joinedAt && (
            <p className="text-sm text-gray-500 mt-2">
              <Calendar className="w-4 h-4 mr-1 inline-block" />
              Joined {new Date(seller.joinedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="md:w-2/3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileField label="Seller Name" value={seller.sellerName} icon={<User />} />
            <ProfileField label="Professional Title" value={seller.professionalTitle} icon={<Edit2 />} />
            <ProfileField label="Phone" value={seller.phone} icon={<Phone />} />
            <ProfileField label="Email" value={seller.email} icon={<Mail />} />
            <ProfileField label="Status" value={seller.status} icon={<CheckCircle />} disabled />
            <div className="md:col-span-2">
              <ProfileField label="Bio" value={seller.bio} icon={<Edit2 />} multiline />
            </div>
            {seller.joinedAt && (
              <ProfileField
                label="Joined"
                value={new Date(seller.joinedAt).toISOString().substring(0, 10)}
                icon={<Calendar />}
                type="date"
                disabled
              />
            )}
          </div>

          {seller.skills && seller.skills.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <div className="flex flex-wrap gap-2">
                {seller.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full border border-green-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleProfileUpdate}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              {saving
                ? (<><Loader className="w-4 h-4 animate-spin mr-2" /> Saving...</>)
                : (<><Save className="w-4 h-4 mr-2" /> Save Changes</>)
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationBanner = ({ type, message, onClose }) => (
  <div className={`mb-6 p-4 rounded-lg flex justify-between items-center ${type === "success"
    ? "bg-green-50 text-green-800"
    : type === "error"
      ? "bg-red-50 text-red-800"
      : "bg-blue-50 text-blue-800"
    }`}>
    <div className="flex items-center gap-2">
      {type === "success" && <CheckCircle className="w-5 h-5" />}
      {type === "error" && <AlertCircle className="w-5 h-5" />}
      {type === "info" && <Clock className="w-5 h-5" />}
      <span>{message}</span>
    </div>
    <button onClick={onClose}><X className="w-4 h-4" /></button>
  </div>
);

const LoadingView = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
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

export default SellerProfile;
