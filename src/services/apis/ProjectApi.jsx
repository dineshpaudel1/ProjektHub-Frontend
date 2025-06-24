// src/apis/ProjectApi.jsx
import { protectedApi } from "../../services/axiosInstance";  // ✅ updated

// Add new project (simplified ✅)
export const addProject = async ({ title, description, categoryId }) => {
    try {
        const response = await protectedApi.post(
            "/seller/project/add",  // ✅ no need full URL, you're already using baseURL
            {
                title,
                description,
                categoryId: Number(categoryId),
            }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Failed to add project:", error.response || error.message);
        throw error;
    }
};

// Fetch seller projects (simplified ✅)
export const getSellerProjects = async () => {
    try {
        const response = await protectedApi.get("/seller/project/my-projects");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch seller projects:", error.response || error.message);
        throw error;
    }
};
