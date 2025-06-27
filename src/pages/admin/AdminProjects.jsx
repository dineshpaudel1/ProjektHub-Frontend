import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaSearch, FaPlus } from 'react-icons/fa';
import { Loader, AlertCircle, X } from 'lucide-react';
import ProjectCard from "../../components/project/ProjectCard";
import AddCategoryModal from '../../modals/AddCategoryModal';
import { protectedApi } from "../../services/axiosInstance";
import { useProjectContext } from '../../context/ProjectContext';
import { toast } from "react-toastify";


const AdminProjects = () => {
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [notification, setNotification] = useState(null);
    const [error, setError] = useState(null);

    const {
        projects,
        loadingProjects: loading,
        fetchCategories,
        categories,
        setCategories
    } = useProjectContext();

    const handleCreateCategory = async () => {
        if (!categoryName.trim()) return;
        try {
            setNotification({ type: 'info', message: 'Creating category...' });
            await protectedApi.post("/admin/category/add", { name: categoryName });
            setShowCategoryModal(false);
            setCategoryName('');
            await fetchCategories();
            toast.success("Category created successfully!");
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error("❌ Failed to create category:", error);
            toast.error("Failed to create category.");
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the category permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await protectedApi.delete(`/admin/category/delete/${categoryId}`);
                setCategories(prev => prev.filter(cat => cat.id !== categoryId));
                setNotification({ type: 'success', message: 'Category deleted successfully!' });
                setTimeout(() => setNotification(null), 3000);
                Swal.fire('Deleted!', 'Category has been deleted.', 'success');
            } catch (err) {
                console.error("❌ Failed to delete category:", err);
                Swal.fire('Error', 'Failed to delete category.', 'error');
            }
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = searchQuery === '' ||
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || project.categoryName === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        return sortBy === 'price-low'
            ? a.price - b.price
            : new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen relative">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="bg-orange-500 text-white p-3 rounded-lg mr-4">
                        <FaFolderOpen size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">All Projects</h1>
                        <p className="text-gray-600 mt-1">Manage and organize all your projects</p>
                    </div>
                </div>
                <button onClick={() => setShowCategoryModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                    <FaPlus size={14} /> Add Category
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                    <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-2 overflow-x-auto">
                <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-lg ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    All Categories
                </button>

                {Array.isArray(categories) && categories.map((cat) => (
                    <div key={cat.id} className="relative group">
                        <button
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`px-4 py-2 rounded-lg mr-1 ${selectedCategory === cat.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            {cat.name}
                        </button>
                        <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hidden group-hover:block"
                            title="Delete Category"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center py-12">
                    <Loader className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6 flex items-center">
                    <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {!loading && !error && sortedProjects.length === 0 && (
                <div className="bg-white p-12 text-center rounded-xl shadow-sm">
                    <div className="bg-gray-100 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6">
                        <FaFolderOpen size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                    <button onClick={() => navigate('/admin/create-project')} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                        <FaPlus size={14} /> Create Project
                    </button>
                </div>
            )}

            {!loading && !error && sortedProjects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProjects.map((project, idx) => (
                        <ProjectCard
                            key={project.id || idx}
                            category={project.categoryName}
                            title={project.title}
                            subtitle="Project Hub"
                            description={project.description}
                            price={project.price}
                            image={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                            bg={project.categoryName}
                            status={project.status || 'active'}
                            date={project.createdAt ? new Date(project.createdAt).toLocaleDateString() : undefined}
                            rating={4.5}
                            reviewCount={12}
                            onClick={() => navigate(`/admin/project/${project.id}`)}
                        />
                    ))}
                </div>
            )}

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
