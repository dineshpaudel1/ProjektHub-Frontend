import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import NotificationToast from "../components/NotificationToast";
const SellerRegisterModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        bio: "",
        professionalTitle: "",
        phone: "",
        skills: [],
        verificationPhoto: null,
    });

    const [notification, setNotification] = useState(null);

    const showToast = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, verificationPhoto: e.target.files[0] });
    };

    const handleSkillChange = (index, value) => {
        const updatedSkills = [...formData.skills];
        updatedSkills[index] = value;
        setFormData({ ...formData, skills: updatedSkills });
    };

    const addSkillField = () => {
        setFormData({ ...formData, skills: [...formData.skills, ""] });
    };

    const handleSubmit = async () => {
        const data = new FormData();
        data.append("bio", formData.bio);
        data.append("professionalTitle", formData.professionalTitle);
        data.append("phone", formData.phone);
        formData.skills.forEach(skill => data.append("skills", skill));
        data.append("verificationPhoto", formData.verificationPhoto);

        const token = localStorage.getItem("token"); // or "accessToken" if that's what you used

        try {
            await axios.post("http://localhost:8080/api/user/seller-register", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`, // 🔥 this line is important
                },
            });
            showToast("Seller registration submitted successfully!", "success");
            setTimeout(() => onClose(), 1000);
        } catch (error) {
            console.error("Registration failed", error);
            showToast("Failed to register as seller.", "error");
        }
    };


    return (
        <>
            <NotificationToast notification={notification} onClose={() => setNotification(null)} />

            <div
                className="absolute top-20 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md border rounded-lg shadow-lg"
                style={{
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                }}
            >
                <div className="flex justify-between items-center px-6 pt-6 pb-2">
                    <h2 className="text-xl font-semibold">Become a Seller</h2>
                    <button
                        onClick={onClose}
                        style={{ color: "var(--text-color)" }}
                        className="hover:text-red-600 text-lg"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 pb-6">
                    <input
                        type="text"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                        className="mb-3 w-full px-3 py-2 border rounded-md"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            color: "var(--text-color)",
                            borderColor: "var(--border-color)",
                        }}
                    />

                    <input
                        type="text"
                        name="professionalTitle"
                        value={formData.professionalTitle}
                        onChange={handleChange}
                        placeholder="Professional Title"
                        className="mb-3 w-full px-3 py-2 border rounded-md"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            color: "var(--text-color)",
                            borderColor: "var(--border-color)",
                        }}
                    />

                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="mb-3 w-full px-3 py-2 border rounded-md"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            color: "var(--text-color)",
                            borderColor: "var(--border-color)",
                        }}
                    />

                    <label className="block mb-2" style={{ color: "var(--text-color)" }}>
                        Skills:
                    </label>
                    {formData.skills.map((skill, index) => (
                        <input
                            key={index}
                            type="text"
                            value={skill}
                            onChange={(e) => handleSkillChange(index, e.target.value)}
                            className="mb-2 w-full px-3 py-2 border rounded-md"
                            style={{
                                backgroundColor: "var(--bg-color)",
                                color: "var(--text-color)",
                                borderColor: "var(--border-color)",
                            }}
                        />
                    ))}

                    <button
                        onClick={addSkillField}
                        className="text-sm mb-4"
                        style={{ color: "var(--button-primary)" }}
                    >
                        + Add Skill
                    </button>

                    <label
                        htmlFor="verificationPhoto"
                        className="block w-full px-3 py-2 border rounded-md cursor-pointer text-sm mb-5"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            color: "var(--text-color)",
                            borderColor: "var(--border-color)",
                        }}
                    >
                        {formData.verificationPhoto?.name || "+ Choose a file..."}
                        <input
                            id="verificationPhoto"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md"
                            style={{
                                backgroundColor: "var(--hover-bg)",
                                color: "var(--text-color)",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-md text-white"
                            style={{
                                backgroundColor: "var(--button-primary)",
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerRegisterModal;
