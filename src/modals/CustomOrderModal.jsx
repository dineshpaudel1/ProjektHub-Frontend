import React, { useState, useRef } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { protectedApi } from "../services/axiosInstance"
import { useNavigate } from "react-router-dom";

const CustomOrderModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        userPhoneNumber: "",
        customTitle: "",
        customDescription: "",
        selectedOptions: []
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const availableOptions = ["Project", "Document", "Figma"];
    const modalRef = useRef();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (option) => {
        setFormData(prev => {
            const selected = prev.selectedOptions.includes(option)
                ? prev.selectedOptions.filter(item => item !== option)
                : [...prev.selectedOptions, option];
            return { ...prev, selectedOptions: selected };
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!/^\d{10}$/.test(formData.userPhoneNumber)) {
            newErrors.userPhoneNumber = "Phone number must be 10 digits.";
        }
        if (!formData.customTitle.trim()) {
            newErrors.customTitle = "Title is required.";
        }
        if (!formData.customDescription.trim()) {
            newErrors.customDescription = "Description is required.";
        }
        if (formData.selectedOptions.length === 0) {
            newErrors.selectedOptions = "Select at least one option.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            userPhoneNumber: formData.userPhoneNumber,
            customTitle: formData.customTitle,
            customDescription: formData.customDescription,
            selectedOptions: formData.selectedOptions   // ✅ directly array of strings
        };

        try {
            setLoading(true);
            await protectedApi.post("/user/order/custom", payload);
            toast.success("Custom order placed successfully!");
            onClose();
            navigate("/my-orders");
            resetForm();
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Failed to place custom order.");
        } finally {
            setLoading(false);
        }
    };
    const resetForm = () => {
        setFormData({
            userPhoneNumber: "",
            customTitle: "",
            customDescription: "",
            selectedOptions: []
        });
        setErrors({});
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl"
                style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)", border: "1px solid var(--border-color)" }}
            >
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                    <h2 className="text-xl font-semibold">Place Custom Order</h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="hover:opacity-80"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 text-left">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-1 pl-1" style={{ color: "var(--text-secondary)" }}>
                                    Title
                                </label>
                                <input
                                    placeholder="Enter your project title."
                                    type="text"
                                    name="customTitle"
                                    value={formData.customTitle}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.customTitle ? "border-red-500" : ""}`}
                                    style={{
                                        borderColor: errors.customTitle ? "#ef4444" : "var(--border-color)",
                                        backgroundColor: "transparent",
                                        color: "var(--text-color)"
                                    }}
                                />
                                {errors.customTitle && (
                                    <p className="mt-1 text-sm text-red-500">{errors.customTitle}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-1 pl-1" style={{ color: "var(--text-secondary)" }}>
                                    Description
                                </label>
                                <textarea
                                    placeholder="Please provide detailed description of your project"
                                    name="customDescription"
                                    value={formData.customDescription}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.customDescription ? "border-red-500" : ""}`}
                                    style={{
                                        borderColor: errors.customDescription ? "#ef4444" : "var(--border-color)",
                                        backgroundColor: "transparent",
                                        color: "var(--text-color)"
                                    }}
                                />
                                {errors.customDescription && (
                                    <p className="mt-1 text-sm text-red-500">{errors.customDescription}</p>
                                )}
                            </div>

                            {/* Options */}
                            <div>
                                <label className="block text-sm font-medium mb-2 pl-1" style={{ color: "var(--text-secondary)" }}>
                                    Options(Select Option for what you want to build)
                                </label>
                                <div className="flex flex-col gap-2">
                                    {availableOptions.map((option, idx) => (
                                        <label key={idx} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.selectedOptions.includes(option)}
                                                onChange={() => handleOptionChange(option)}
                                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm" style={{ color: "var(--text-color)" }}>{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.selectedOptions && (
                                    <p className="mt-1 text-sm text-red-500">{errors.selectedOptions}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 pl-1" style={{ color: "var(--text-secondary)" }}>
                                    Phone Number (you will be contacted via whatsapp)
                                </label>
                                <input
                                    type="text"
                                    name="userPhoneNumber"
                                    value={formData.userPhoneNumber}
                                    onChange={handleChange}
                                    placeholder="98XXXXXXXX"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.userPhoneNumber ? "border-red-500" : ""}`}
                                    style={{
                                        borderColor: errors.userPhoneNumber ? "#ef4444" : "var(--border-color)",
                                        backgroundColor: "transparent",
                                        color: "var(--text-color)"
                                    }}
                                />
                                {errors.userPhoneNumber && (
                                    <p className="mt-1 text-sm text-red-500">{errors.userPhoneNumber}</p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium rounded-md focus:outline-none"
                                style={{
                                    backgroundColor: "var(--hover-bg)",
                                    color: "var(--text-color)",
                                    border: "1px solid var(--border-color)"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white rounded-md flex items-center justify-center"
                                style={{
                                    backgroundColor: "var(--button-primary)"
                                }}
                            >
                                {loading && <FaSpinner className="animate-spin mr-2" />}
                                Place Order
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomOrderModal;
