import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaFolderOpen,
    FaSearch,
    FaPlus,
} from 'react-icons/fa';
import { Loader, AlertCircle, X } from 'lucide-react';
import ProjectCard from './ProjectCard';
import AddCategoryModal from '../../modals/AddCategoryModal';
import axios from "../../utils/axiosInstance";
import { getSellerProjects } from "../../apis/ProjectApi";

const AdminProjects = () => {
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication required");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/users/category', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data.data || []);
            } catch (error) {
                console.error('❌ Failed to fetch categories:', error);
                setError("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    // Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const data = await getSellerProjects();
                setProjects(data?.data || []);
                setLoading(false);
            } catch (error) {
                console.error("❌ Failed to fetch projects:", error);
                setError("Failed to load projects");
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleCreateCategory = async () => {
        const token = localStorage.getItem("token");

        if (!categoryName.trim() || !token) return;

        try {
            setNotification({ type: 'info', message: 'Creating category...' });

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

            const refreshed = await axios.get('http://localhost:8080/api/users/category', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(refreshed.data.data || []);

            setNotification({ type: 'success', message: 'Category created successfully!' });
            setTimeout(() => setNotification(null), 3000);

        } catch (error) {
            console.error("❌ Failed to create category:", error.response || error.message);
            setNotification({ type: 'error', message: 'Failed to create category' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    // Filter projects based on search, category, and price range
    const filteredProjects = projects.filter(project => {
        const matchesSearch = searchQuery === '' ||
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' ||
            project.categoryName === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Sort projects
    const sortedProjects = [...filteredProjects].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            default:
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen relative">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center">
                        <div className="bg-orange-500 text-white p-3 rounded-lg mr-4">
                            <FaFolderOpen size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">All Projects</h1>
                            <p className="text-gray-600 mt-1">Manage and organize all your projects</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCategoryModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <FaPlus size={14} />
                            Add Category
                        </button>

                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All Categories
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.name
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 text-lg">Loading projects...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
                    <div className="flex items-center">
                        <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                        <p className="text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && sortedProjects.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <FaFolderOpen size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects found</h3>
                    <div className="flex justify-center gap-4">

                        <button
                            onClick={() => navigate('/admin/create-project')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <FaPlus size={14} />
                            Create Project
                        </button>
                    </div>
                </div>
            )}

            {/* Projects Grid */}
            {!loading && !error && sortedProjects.length > 0 && (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }>
                    {sortedProjects.map((project, idx) => (

                        <ProjectCard
                            key={project.id || idx}
                            category={project.categoryName}
                            title={project.title}
                            subtitle="Project Hub"
                            description={project.description}
                            price={project.price}
                            image={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                            bg={(project.categoryName)}
                            status={project.status || 'active'}
                            date={project.createdAt ? new Date(project.createdAt).toLocaleDateString() : undefined}
                            rating={4.5}
                            reviewCount={12}
                            onClick={() => navigate(`/admin/project/${project.id}`)}
                        />
                    ))}
                </div>
            )}

            {/* Add Category Modal */}
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