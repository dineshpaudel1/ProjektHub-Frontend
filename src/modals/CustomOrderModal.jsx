import React, { useState, useRef, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOptionChange = (option) => {
        const updatedOptions = formData.selectedOptions.includes(option)
            ? formData.selectedOptions.filter(item => item !== option)
            : [...formData.selectedOptions, option];
        setFormData({ ...formData, selectedOptions: updatedOptions });
    };

    const validateForm = () => {
        const errs = {};
        if (!formData.userPhoneNumber.match(/^98\d{8}$/)) {
            errs.userPhoneNumber = "Phone number must start with 98 and be 10 digits.";
        }
        if (!formData.customTitle.trim()) {
            errs.customTitle = "Custom Title is required.";
        }
        if (!formData.customDescription.trim()) {
            errs.customDescription = "Custom Description is required.";
        }
        if (formData.selectedOptions.length === 0) {
            errs.selectedOptions = "At least one option must be selected.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            userPhoneNumber: formData.userPhoneNumber,
            customTitle: formData.customTitle,
            customDescription: formData.customDescription,
            selectedOptions: formData.selectedOptions.map(option => ({ optionName: option }))
        };

        try {
            setLoading(true);
            await axios.post("/user/order/custom", payload);
            toast.success("Custom order placed successfully!");
            onClose();
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

    // ✅ Optional: Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target) && !loading) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, loading, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 backdrop-blur-sm bg-black/10 font-[var(--font-primary)]">
            <div ref={modalRef} className="bg-white p-6 rounded-xl w-full max-w-lg relative shadow-xl text-black max-h-[90vh] overflow-y-auto">

                <button onClick={onClose} disabled={loading} className="absolute top-3 right-4 text-xl font-bold">×</button>

                <h2 className="text-2xl font-semibold mb-4">Place Custom Order</h2>
                <form onSubmit={handleSubmit}>

                    {/* Phone Number */}
                    <div className="mb-3">
                        <label className="block font-medium mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="userPhoneNumber"
                            value={formData.userPhoneNumber}
                            onChange={handleChange}
                            className={`w-full border rounded p-2 ${errors.userPhoneNumber ? "border-red-500" : ""}`}
                        />
                        {errors.userPhoneNumber && <p className="text-red-500 text-sm">{errors.userPhoneNumber}</p>}
                    </div>

                    {/* Custom Title */}
                    <div className="mb-3">
                        <label className="block font-medium mb-1">Custom Title</label>
                        <input
                            type="text"
                            name="customTitle"
                            value={formData.customTitle}
                            onChange={handleChange}
                            className={`w-full border rounded p-2 ${errors.customTitle ? "border-red-500" : ""}`}
                        />
                        {errors.customTitle && <p className="text-red-500 text-sm">{errors.customTitle}</p>}
                    </div>

                    {/* Custom Description */}
                    <div className="mb-3">
                        <label className="block font-medium mb-1">Custom Description</label>
                        <textarea
                            name="customDescription"
                            value={formData.customDescription}
                            onChange={handleChange}
                            className={`w-full border rounded p-2 ${errors.customDescription ? "border-red-500" : ""}`}
                        />
                        {errors.customDescription && <p className="text-red-500 text-sm">{errors.customDescription}</p>}
                    </div>

                    {/* Options */}
                    <div className="mb-3">
                        <label className="block font-medium mb-1">Select Options</label>
                        <div className="flex flex-wrap gap-4">
                            {availableOptions.map((option, idx) => (
                                <label key={idx} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedOptions.includes(option)}
                                        onChange={() => handleOptionChange(option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                        {errors.selectedOptions && <p className="text-red-500 text-sm">{errors.selectedOptions}</p>}
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-300 rounded">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center gap-2">
                            {loading && <FaSpinner className="animate-spin" />} Place Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomOrderModal;
