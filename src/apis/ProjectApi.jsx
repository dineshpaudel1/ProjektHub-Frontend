// src/apis/ProjectApi.jsx
import axios from "../utils/axiosInstance";

// Add new project (unchanged)
export const addProject = async ({ title, description, categoryId }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token not found.");

    try {
        const response = await axios.post(
            "http://localhost:8080/api/seller/project/add",
            {
                title,
                description,
                categoryId: Number(categoryId),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Failed to add project:", error.response || error.message);
        throw error;
    }
};

// Fetch seller projects → return raw response
export const getSellerProjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token not found.");

    try {
        const response = await axios.get("http://localhost:8080/api/seller/project/my-projects", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;


    } catch (error) {
        console.error("Failed to fetch seller projects:", error.response || error.message);
        throw error;
    }
};
