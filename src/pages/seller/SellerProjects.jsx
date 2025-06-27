import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaSearch, FaPlus } from 'react-icons/fa';
import { Grid, List, Loader, AlertCircle, X, Check } from 'lucide-react';
import ProjectCard from "../../components/project/ProjectCard";
import AddProjectModal from '../../modals/AddProjectModal';
import { publicApi, protectedApi } from "../../services/axiosInstance";
import { toast } from 'react-toastify';

const SellerProjects = () => {
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const [showProjectModal, setShowProjectModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [notification, setNotification] = useState(null);
    const [projectForm, setProjectForm] = useState({ title: '', description: '', categoryId: '' });

    const getBgColorForCategory = (category) => {
        const map = {
            'Web Development': 'bg-blue-600',
            'Mobile App': 'bg-green-600',
            'UI/UX Design': 'bg-purple-600',
            'E-commerce': 'bg-orange-500',
            'Marketing': 'bg-red-500',
            'Default': 'bg-gray-700',
        };
        return map[category] || map.Default;
    };

    const mapProjects = (raw) =>
        raw.map((item) => ({
            id: item.id,
            title: item.title || 'Untitled Project',
            description: item.description || 'No description available.',
            price: item.price || '0',
            image: `${import.meta.env.VITE_API_URL}/media/photo?file=${item.thumbnail}`,
            category: item.categoryName || 'Uncategorized',
            bg: getBgColorForCategory(item.categoryName),
            createdAt: item.createdAt,
            status: item.status || 'active',
            views: Math.floor(Math.random() * 1000),
            rating: (Math.random() * 2 + 3).toFixed(1),
        }));

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const catRes = await publicApi.get('/public/category');
            setCategories(catRes.data.data || []);

            const projRes = await protectedApi.get('/seller/project/my-projects');
            setProjects(mapProjects(projRes.data.data || []));
        } catch (err) {
            console.error("❌ Error loading data:", err);
            setError("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleCreateProject = async () => {
        const { title, description, categoryId } = projectForm;
        if (!title || !description || !categoryId) {
            setNotification({ type: 'error', message: 'Please fill all fields' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        try {
            setNotification({ type: 'info', message: 'Creating project...' });
            await protectedApi.post('/seller/project/add', { title, description, categoryId });
            setShowProjectModal(false);
            setProjectForm({ title: '', description: '', categoryId: '' });
            await fetchAllData();
            toast("Project created sucessfully")
        } catch (err) {
            console.error("Error creating project:", err);
            setNotification({ type: 'error', message: 'Failed to create project' });
        } finally {
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
            || project.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen relative">

            {/* Notification */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center justify-between max-w-md animate-fade-in 
                ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                        notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
                            'bg-blue-50 text-blue-800 border-l-4 border-blue-500'}`}>
                    <div className="flex items-center">
                        {notification.type === 'success' && <Check className="w-5 h-5 mr-3" />}
                        {notification.type === 'error' && <AlertCircle className="w-5 h-5 mr-3" />}
                        {notification.type === 'info' && <Loader className="w-5 h-5 mr-3 animate-spin" />}
                        <p>{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="ml-4 text-gray-500 hover:text-gray-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="bg-orange-500 text-white p-3 rounded-lg mr-4">
                            <FaFolderOpen size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
                            <p className="text-gray-600">Manage and track your projects</p>
                        </div>
                    </div>
                    <button onClick={() => setShowProjectModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                        <FaPlus size={14} /> Add Project
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3">
                            <X size={16} className="text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 overflow-x-auto">
                <div className="flex gap-2">
                    <button onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium 
                            ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        All
                    </button>
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium 
                                ${selectedCategory === cat.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="flex justify-center py-12">
                    <Loader className="animate-spin h-10 w-10 text-blue-600" />
                </div>
            )}

            {error && !loading && (
                <div className="bg-red-50 p-6 rounded-lg text-red-600">{error}</div>
            )}

            {!loading && !error && sortedProjects.length === 0 && (
                <div className="bg-white p-12 rounded-xl text-center">
                    <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                    <button onClick={() => setShowProjectModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        Add Your First Project
                    </button>
                </div>
            )}

            {!loading && sortedProjects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProjects.map(project => (
                        <div key={project.id} onClick={() => navigate(`/seller/project/${project.id}`)}>
                            <ProjectCard {...project} />
                        </div>
                    ))}
                </div>
            )}

            <AddProjectModal
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                onCreate={handleCreateProject}
                formData={projectForm}
                setFormData={setProjectForm}
                categories={categories}
            />

        </div>
    );
};

export default SellerProjects;
