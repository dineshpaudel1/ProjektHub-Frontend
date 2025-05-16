import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaFolderOpen,
    FaSearch,
    FaPlus,
} from 'react-icons/fa';
import {
    Grid,
    List,
    Loader,
    AlertCircle,
    X,
    Check,
} from 'lucide-react';
import ProjectCard from '../../components/ProjectCard';
import AddProjectModal from '../../modals/AddProjectModal';
import axios from '../../utils/axiosInstance';
import { getSellerProjects, addProject } from '../../apis/ProjectApi';

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
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [notification, setNotification] = useState(null);
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        categoryId: '',
    });
    const [contextMenuPosition, setContextMenuPosition] = useState({
        show: false, x: 0, y: 0, projectId: null
    });

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
            image: `http://localhost:8080/api/media/photo?file=${item.thumbnail}`,
            category: item.categoryName || 'Uncategorized',
            bg: getBgColorForCategory(item.categoryName),
            createdAt: item.createdAt,
            status: item.status || 'active',
            views: Math.floor(Math.random() * 1000),
            rating: (Math.random() * 2 + 3).toFixed(1),
        }));

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                setLoading(false);
                return;
            }
            try {
                const catRes = await axios.get('http://localhost:8080/api/users/category', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(catRes.data.data || []);
                const projRes = await getSellerProjects();
                setProjects(mapProjects(projRes.data));
                setLoading(false);
            } catch (error) {
                console.error('❌ Failed to fetch data:', error);
                setError('Failed to load data');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateProject = async () => {
        const { title, description, categoryId } = projectForm;
        if (!title || !description || !categoryId) {
            setNotification({ type: 'error', message: 'Please fill all required fields' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        try {
            setNotification({ type: 'info', message: 'Creating project...' });
            await addProject({ title, description, categoryId });
            setShowProjectModal(false);
            setProjectForm({ title: '', description: '', categoryId: '' });
            const updatedProjects = await getSellerProjects();
            setProjects(mapProjects(updatedProjects.data));
            setNotification({ type: 'success', message: 'Project created successfully!' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Error adding project:', error);
            setNotification({ type: 'error', message: 'Failed to create project' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
        const price = parseFloat(project.price) || 0;
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return parseFloat(a.price) - parseFloat(b.price);
            case 'newest':
            default: return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
    useEffect(() => {
        const handleClickOutside = () => {
            if (contextMenuPosition.show) {
                setContextMenuPosition({ ...contextMenuPosition, show: false });
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenuPosition]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen relative">

            {/* Notification */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center justify-between max-w-md animate-fade-in ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 'bg-blue-50 text-blue-800 border-l-4 border-blue-500'}`}>
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
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center">
                        <div className="bg-orange-500 text-white p-3 rounded-lg mr-4">
                            <FaFolderOpen size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
                            <p className="text-gray-600 mt-1">Manage and track your project portfolio</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowProjectModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <FaPlus size={14} />
                            Add Project
                        </button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
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

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
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

            {/* Project List */}
            {!loading && !error && sortedProjects.length > 0 && (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
                    {sortedProjects.map((project) => (
                        <div key={project.id} className="relative group">
                            <div
                                className="cursor-pointer transition-transform group-hover:scale-[1.02] duration-200"
                                onClick={() => navigate(`/seller/projects/${project.id}`)}
                            >
                                <ProjectCard
                                    id={project.id}
                                    title={project.title}
                                    image={project.image}
                                    price={project.price}
                                    category={project.category}
                                    bg={getBgColorForCategory(project.category)}
                                    status={project.status}
                                    date={project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}
                                    rating={project.rating}
                                    reviewCount={project.views}
                                    onClick={() => navigate(`/seller/projects/${project.id}`)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Project Modal */}
            <AddProjectModal
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                onCreate={handleCreateProject}
                formData={projectForm}
                setFormData={setProjectForm}
                categories={categories}
            />
            <style>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`}</style>


        </div>
    );
};

export default SellerProjects;
