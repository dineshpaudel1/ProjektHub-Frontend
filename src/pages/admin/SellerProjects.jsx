import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaFolderOpen,
    FaSearch,
    FaPlus,
    FaEllipsisV,
    FaChartLine,
    FaEdit,
    FaTrash,
    FaCopy
} from 'react-icons/fa';
import { Grid, List, Loader, AlertCircle, X, ChevronDown, Check, RefreshCw, Filter, SortDesc, BarChart4, Clock, Star, Eye, DollarSign } from 'lucide-react';
import ProjectCard from './ProjectCard';
import AddProjectModal from '../../modals/AddProjectModal';
import axios from "../../utils/axiosInstance";
import { getSellerProjects, addProject } from "../../apis/ProjectApi";

const SellerProjects = () => {
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // State
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [notification, setNotification] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showStatsPanel, setShowStatsPanel] = useState(true);
    const [activeProjects, setActiveProjects] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        categoryId: '',
    });
    const [contextMenuPosition, setContextMenuPosition] = useState({ show: false, x: 0, y: 0, projectId: null });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication required");
                setLoading(false);
                return;
            }

            try {
                // Fetch categories
                const catRes = await axios.get('http://localhost:8080/api/users/category', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(catRes.data.data || []);

                // Fetch projects
                const projRes = await getSellerProjects();
                const mappedProjects = projRes.data.map((item) => ({
                    id: item.id,
                    title: item.title || "Untitled Project",
                    subtitle: "By projecthub",
                    description: item.description || "No description available.",
                    price: item.price || "No Price Available.",
                    image: `http://localhost:8080/api/media/photo?file=${item.thumbnail}`,
                    category: item.categoryName || "Uncategorized",
                    bg: getBgColorForCategory(item.categoryName),
                    createdAt: item.createdAt,
                    status: item.status || 'active',
                    views: Math.floor(Math.random() * 1000), // Placeholder for demo
                    rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
                }));

                setProjects(mappedProjects);

                // Calculate stats
                setActiveProjects(mappedProjects.filter(p => p.status === 'active').length);
                setTotalViews(mappedProjects.reduce((sum, p) => sum + (p.views || 0), 0));
                setTotalRevenue(mappedProjects.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0));
                setAverageRating(
                    mappedProjects.length > 0
                        ? (mappedProjects.reduce((sum, p) => sum + (parseFloat(p.rating) || 0), 0) / mappedProjects.length).toFixed(1)
                        : 0
                );

                setLoading(false);
            } catch (error) {
                console.error('❌ Failed to fetch data:', error);
                setError("Failed to load data");
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
            const mappedProjects = updatedProjects.data.map((item) => ({
                id: item.id,
                title: item.title || "Untitled Project",
                subtitle: "By projecthub",
                description: item.description || "No description available.",
                price: item.price || "No Price Available.",
                image: `http://localhost:8080/api/media/photo?file=${item.thumbnail}`,
                category: item.categoryName || "Uncategorized",
                bg: getBgColorForCategory(item.categoryName),
                createdAt: item.createdAt,
                status: item.status || 'active',
                views: Math.floor(Math.random() * 1000), // Placeholder for demo
                rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
            }));

            setProjects(mappedProjects);

            // Update stats
            setActiveProjects(mappedProjects.filter(p => p.status === 'active').length);
            setTotalViews(mappedProjects.reduce((sum, p) => sum + (p.views || 0), 0));
            setTotalRevenue(mappedProjects.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0));
            setAverageRating(
                mappedProjects.length > 0
                    ? (mappedProjects.reduce((sum, p) => sum + (parseFloat(p.rating) || 0), 0) / mappedProjects.length).toFixed(1)
                    : 0
            );

            setNotification({ type: 'success', message: 'Project created successfully!' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error("Error adding project:", error);
            setNotification({ type: 'error', message: 'Failed to create project' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication required");
                return;
            }

            // Fetch categories
            const catRes = await axios.get('http://localhost:8080/api/users/category', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(catRes.data.data || []);

            // Fetch projects
            const projRes = await getSellerProjects();
            const mappedProjects = projRes.data.map((item) => ({
                id: item.id,
                title: item.title || "Untitled Project",
                subtitle: "By projecthub",
                description: item.description || "No description available.",
                price: item.price || "No Price Available.",
                image: `http://localhost:8080/api/media/photo?file=${item.thumbnail}`,
                category: item.categoryName || "Uncategorized",
                bg: getBgColorForCategory(item.categoryName),
                createdAt: item.createdAt,
                status: item.status || 'active',
                views: Math.floor(Math.random() * 1000), // Placeholder for demo
                rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
            }));

            setProjects(mappedProjects);

            // Update stats
            setActiveProjects(mappedProjects.filter(p => p.status === 'active').length);
            setTotalViews(mappedProjects.reduce((sum, p) => sum + (p.views || 0), 0));
            setTotalRevenue(mappedProjects.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0));
            setAverageRating(
                mappedProjects.length > 0
                    ? (mappedProjects.reduce((sum, p) => sum + (parseFloat(p.rating) || 0), 0) / mappedProjects.length).toFixed(1)
                    : 0
            );

            setNotification({ type: 'success', message: 'Data refreshed successfully!' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error("❌ Failed to refresh data:", error);
            setNotification({ type: 'error', message: 'Failed to refresh data' });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setRefreshing(false);
        }
    };

    // Get background color based on category
    const getBgColorForCategory = (category) => {
        const colorMap = {
            'Web Development': 'bg-blue-600',
            'Mobile App': 'bg-green-600',
            'UI/UX Design': 'bg-purple-600',
            'E-commerce': 'bg-orange-500',
            'Marketing': 'bg-red-500',
            'Default': 'bg-gray-700'
        };

        return colorMap[category] || colorMap['Default'];
    };

    // Filter projects based on search, category, and price range
    const filteredProjects = projects.filter(project => {
        const matchesSearch = searchQuery === '' ||
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' ||
            project.category === selectedCategory;

        const price = parseFloat(project.price) || 0; // ensure numeric comparison
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
    });


    // Sort projects
    const sortedProjects = [...filteredProjects].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseFloat(a.price) - parseFloat(b.price);
            case 'price-high':
                return parseFloat(b.price) - parseFloat(a.price);
            case 'title':
                return a.title.localeCompare(b.title);
            case 'rating':
                return parseFloat(b.rating) - parseFloat(a.rating);
            case 'views':
                return (b.views || 0) - (a.views || 0);
            case 'newest':
            default:
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
    });



    // Handle context menu
    const handleContextMenu = (e, projectId) => {
        e.preventDefault();
        setContextMenuPosition({
            show: true,
            x: e.clientX,
            y: e.clientY,
            projectId
        });
    };

    // Close context menu when clicking elsewhere
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
                <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center justify-between max-w-md animate-fade-in ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                    notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
                        'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
                    }`}>
                    <div className="flex items-center">
                        {notification.type === 'success' && <Check className="w-5 h-5 mr-3" />}
                        {notification.type === 'error' && <AlertCircle className="w-5 h-5 mr-3" />}
                        {notification.type === 'info' && <Loader className="w-5 h-5 mr-3 animate-spin" />}
                        <p>{notification.message}</p>
                    </div>
                    <button
                        onClick={() => setNotification(null)}
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Context Menu */}
            {contextMenuPosition.show && (
                <div
                    className="fixed bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-200 w-48 animate-fade-in"
                    style={{
                        top: `${contextMenuPosition.y}px`,
                        left: `${contextMenuPosition.x}px`,
                        transform: 'translate(-90%, -10%)'
                    }}
                >
                    <button
                        onClick={() => {
                            navigate(`/admin/seller/projects/${contextMenuPosition.projectId}`);
                            setContextMenuPosition({ ...contextMenuPosition, show: false });
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        <Eye size={16} className="mr-2" />
                        <span>View Details</span>
                    </button>
                    <button
                        onClick={() => {
                            navigate(`/admin/seller/projects/${contextMenuPosition.projectId}/edit`);
                            setContextMenuPosition({ ...contextMenuPosition, show: false });
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        <FaEdit size={16} className="mr-2" />
                        <span>Edit Project</span>
                    </button>
                    <button
                        onClick={() => {
                            // Duplicate project logic would go here
                            setContextMenuPosition({ ...contextMenuPosition, show: false });
                            setNotification({ type: 'info', message: 'Duplicating project...' });
                            setTimeout(() => {
                                setNotification({ type: 'success', message: 'Project duplicated!' });
                                setTimeout(() => setNotification(null), 3000);
                            }, 1000);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        <FaCopy size={16} className="mr-2" />
                        <span>Duplicate</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                        onClick={() => {
                            // Delete project logic would go here
                            setContextMenuPosition({ ...contextMenuPosition, show: false });
                            setNotification({ type: 'error', message: 'Project deleted' });
                            setTimeout(() => setNotification(null), 3000);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        <FaTrash size={16} className="mr-2" />
                        <span>Delete</span>
                    </button>
                </div>
            )}

            {/* Header Section */}
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
                            onClick={() => setShowStatsPanel(!showStatsPanel)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                        >
                            <BarChart4 size={18} />
                            {showStatsPanel ? 'Hide Stats' : 'Show Stats'}
                        </button>
                        <button
                            onClick={() => setShowProjectModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <FaPlus size={14} />
                            Add Project
                        </button>
                        <button
                            onClick={handleRefresh}
                            className={`p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition ${refreshing ? 'animate-spin' : ''}`}
                            disabled={refreshing}
                            aria-label="Refresh"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Searh and Filter Bar */}
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

                    {/* View Toggle */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            aria-label="Grid view"
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            aria-label="List view"
                        >
                            <List size={18} />
                        </button>
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
                            {cat.name || "Unnamed"}
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
                    <button
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && sortedProjects.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <FaFolderOpen size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery || selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000
                            ? "Try adjusting your search or filters to find what you're looking for."
                            : "Get started by creating your first project."}
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setPriceRange([0, 10000]);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Clear Filters
                        </button>
                        <button
                            onClick={() => setShowProjectModal(true)}
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
                    {sortedProjects.map((project) => (
                        viewMode === 'grid' ? (
                            <div
                                key={project.id}
                                className="relative group"
                                onContextMenu={(e) => handleContextMenu(e, project.id)}
                            >
                                <div
                                    className="cursor-pointer transition-transform group-hover:scale-[1.02] duration-200"
                                    onClick={() => navigate(`/admin/seller/projects/${project.id}`)}
                                >
                                    <ProjectCard {...project} />
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleContextMenu(e, project.id);
                                        }}
                                        className="p-2 bg-white/90 rounded-full shadow-md hover:bg-gray-100"
                                    >
                                        <FaEllipsisV size={14} className="text-gray-700" />
                                    </button>
                                </div>
                                {project.status && project.status !== 'active' && (
                                    <div className="absolute top-2 left-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            project.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute bottom-16 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-1 bg-white/90 rounded-full shadow-md p-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/seller/projects/${project.id}/edit`);
                                            }}
                                            className="p-2 rounded-full hover:bg-gray-100"
                                            title="Edit Project"
                                        >
                                            <FaEdit size={14} className="text-gray-700" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Analytics logic would go here
                                                setNotification({ type: 'info', message: 'Opening analytics...' });
                                                setTimeout(() => setNotification(null), 2000);
                                            }}
                                            className="p-2 rounded-full hover:bg-gray-100"
                                            title="View Analytics"
                                        >
                                            <FaChartLine size={14} className="text-gray-700" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Duplicate logic would go here
                                                setNotification({ type: 'success', message: 'Project duplicated!' });
                                                setTimeout(() => setNotification(null), 3000);
                                            }}
                                            className="p-2 rounded-full hover:bg-gray-100"
                                            title="Duplicate Project"
                                        >
                                            <FaCopy size={14} className="text-gray-700" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={project.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex hover:shadow-md transition-shadow group"
                                onContextMenu={(e) => handleContextMenu(e, project.id)}
                            >
                                <div
                                    className="w-32 h-32 flex-shrink-0 cursor-pointer"
                                    onClick={() => navigate(`/admin/seller/projects/${project.id}`)}
                                >
                                    <img
                                        src={project.image || "/placeholder.svg"}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "/placeholder.svg?height=128&width=128";
                                        }}
                                    />
                                </div>
                                <div
                                    className="p-4 flex-grow cursor-pointer"
                                    onClick={() => navigate(`/admin/seller/projects/${project.id}`)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${project.bg.replace('bg-', 'bg-').replace('-600', '-100').replace('-500', '-100')
                                                } ${project.bg.replace('bg-', 'text-').replace('-600', '-800').replace('-500', '-800')
                                                }`}>
                                                {project.category}
                                            </span>
                                            <h3 className="font-bold text-gray-900 mt-1">{project.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{project.description}</p>
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">${project.price}</div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <div className="flex items-center text-sm text-gray-500">
                                            {project.status && (
                                                <>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {project.status}
                                                    </span>
                                                    <span className="mx-2">•</span>
                                                </>
                                            )}
                                            <div className="flex items-center">
                                                <Clock size={14} className="mr-1" />
                                                <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'No date'}</span>
                                            </div>
                                            <span className="mx-2">•</span>
                                            <div className="flex items-center">
                                                <Eye size={14} className="mr-1" />
                                                <span>{project.views || 0}</span>
                                            </div>
                                            <span className="mx-2">•</span>
                                            <div className="flex items-center">
                                                <Star size={14} className="mr-1 text-amber-500" />
                                                <span>{project.rating || '0.0'}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/admin/seller/projects/${project.id}/edit`);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                                title="Edit Project"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Analytics logic would go here
                                                    setNotification({ type: 'info', message: 'Opening analytics...' });
                                                    setTimeout(() => setNotification(null), 2000);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                                title="View Analytics"
                                            >
                                                <FaChartLine size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleContextMenu(e, project.id);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                                title="More Options"
                                            >
                                                <FaEllipsisV size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
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

            {/* Add CSS for animations */}
            <style jsx>{`
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