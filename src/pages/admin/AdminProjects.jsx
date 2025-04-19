import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFolderOpen } from 'react-icons/fa';
import thumbnail from '../../assets/images/thumbnailone.png';
import ProjectCard from './ProjectCard';
import AddCategoryModal from '../../modals/AddCategoryModal';
import axios from "../../utils/axiosInstance";


const AdminProjects = () => {
    const navigate = useNavigate();

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:8080/api/users/category', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data.data || []);
                console.log(response.data)
            } catch (error) {
                console.error('❌ Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCreateCategory = async () => {
        const token = localStorage.getItem("token");

        if (!categoryName.trim() || !token) return;

        try {
            const response = await axios.post(
                "http://localhost:8080/api/admin/category/add",
                { name: categoryName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("✅ Category Created:", response.data);
            setShowCategoryModal(false);
            setCategoryName('');

            // Refetch categories after adding
            const refreshed = await axios.get('http://localhost:8080/api/users/category', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(refreshed.data.data || []);

        } catch (error) {
            console.error("❌ Failed to create category:", error.response || error.message);
        }
    };


    const projects = [
        {
            category: "Website",
            title: "Music Recommender System",
            subtitle: "Project Hub",
            description: "The Music Recommender System is a Web based Project...",
            image: thumbnail,
            bg: "bg-purple-600"
        },
        {
            category: "Website",
            title: "Music Recommender System",
            subtitle: "Project Hub",
            description: "The Music Recommender System is a Web based Project...",
            image: thumbnail,
            bg: "bg-gray-800"
        },
        {
            category: "Website",
            title: "Book Recommender System",
            subtitle: "Project Hub",
            description: "The Music Recommender System is a Web based Project...",
            image: thumbnail,
            bg: "bg-gray-800"
        },
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="bg-orange-500 text-white p-2 rounded mr-2">
                        <FaFolderOpen />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">All Projects</h1>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCategoryModal(true)}
                        className="px-5 py-1.5 text-blue-500 border border-blue-500 rounded-full hover:bg-blue-50 transition text-sm"
                    >
                        Add Category
                    </button>
                </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className="px-5 py-1.5 text-blue-500 border border-blue-500 rounded-full text-sm hover:bg-blue-50 transition"
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project, idx) => (
                    <ProjectCard key={idx} {...project} />
                ))}
            </div>

            {/* Category Modal */}
            <AddCategoryModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onCreate={handleCreateCategory}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
            />
        </div>
    );
};

export default AdminProjects;
