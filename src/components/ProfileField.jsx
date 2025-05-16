import React from "react";

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
                    className={`w-full border border-gray-300 rounded-lg pl-10 py-2 pr-3 text-gray-900 ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'} transition-all duration-200`}
                />
            ) : (
                <input
                    type={type}
                    defaultValue={value || ''}
                    disabled={disabled}
                    className={`w-full border border-gray-300 rounded-lg pl-10 py-2 pr-3 text-gray-900 ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'} transition-all duration-200`}
                />
            )}
        </div>
    </div>
);

export default ProfileField;
