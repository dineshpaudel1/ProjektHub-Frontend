import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFolderOpen } from 'react-icons/fa';
import ProjectCard from './ProjectCard';
import AddProjectModal from '../../modals/AddProjectModal';
import axios from "../../utils/axiosInstance";
import { getSellerProjects, addProject } from "../../apis/ProjectApi";

const SellerProjects = () => {
    const navigate = useNavigate();

    const [showProjectModal, setShowProjectModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        categoryId: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const catRes = await axios.get('http://localhost:8080/api/users/category', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(catRes.data.data || []);

                const projRes = await getSellerProjects();
                const mappedProjects = projRes.data.map((item) => ({
                    id: item.id,
                    title: item.title || "Untitled Project",
                    subtitle: "By projecthub",
                    description: item.description || "No description available.",
                    price: item.price || "No Price Available.",
                    image: `http://localhost:8080/api/media/photo?file=${item.thumbnail}`,
                    category: item.categoryName || "Uncategorized",
                    bg: "bg-gray-800",
                }));

                setProjects(mappedProjects);
            } catch (error) {
                console.error('❌ Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    const handleCreateProject = async () => {
        const { title, description, categoryId } = projectForm;
        if (!title || !description || !categoryId) return;

        try {
            await addProject({ title, description, categoryId });
            setShowProjectModal(false);
            setProjectForm({ title: '', description: '', categoryId: '' });

            const updatedProjects = await getSellerProjects();
            console.log("fuck you")
            const mappedProjects = updatedProjects.data.map((item) => ({
                id: item.id,
                title: item.title || "Untitled Project",
                subtitle: "By projecthub",
                description: item.description || "No description available.",
                price: item.price || "No Price Available.",
                image: `http://localhost:8080/api/media/photo?file=${item.thumbnail}`,
                category: item.categoryName || "Uncategorized",
                bg: "bg-gray-800",
            }));

            setProjects(mappedProjects);
        } catch (error) {
            console.error("Error adding project:", error);
            alert("Failed to add project. Please try again.");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="bg-orange-500 text-white p-2 rounded mr-2">
                        <FaFolderOpen />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
                </div>

                <button
                    onClick={() => setShowProjectModal(true)}
                    className="px-5 py-1.5 text-blue-500 border border-blue-500 rounded-full hover:bg-blue-50 transition text-sm"
                >
                    Add Projects
                </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className="px-5 py-1.5 text-blue-500 border border-blue-500 rounded-full text-sm hover:bg-blue-50 transition"
                    >
                        {cat.name || "Unnamed"}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => navigate(`/admin/seller/projects/${project.id}`)}
                        className="cursor-pointer"
                    >
                        <ProjectCard {...project} />
                    </div>
                ))}
            </div>

            <AddProjectModal
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                onCreate={handleCreateProject}
                formData={projectForm}
                setFormData={setProjectForm}
            />
        </div>
    );
};

export default SellerProjects;
