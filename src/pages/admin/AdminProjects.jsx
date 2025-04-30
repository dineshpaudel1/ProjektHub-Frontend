import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaFolderOpen,
    FaSearch,
    FaPlus,
    FaEllipsisV
} from 'react-icons/fa';
import { Grid, List, Loader, AlertCircle, X, ChevronDown, Check, RefreshCw, Filter, SortDesc } from 'lucide-react';
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
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 10000]);

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

        const matchesPrice = project.price >= priceRange[0] &&
            project.price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort projects
    const sortedProjects = [...filteredProjects].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'title':
                return a.title.localeCompare(b.title);
            case 'newest':
            default:
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
    });

    // Get sort option label
    const getSortLabel = () => {
        switch (sortBy) {
            case 'price-low': return 'Price: Low to High';
            case 'price-high': return 'Price: High to Low';
            case 'title': return 'Title';
            case 'newest': return 'Newest First';
            default: return 'Sort By';
        }
    };

    // Get background color for project cards
    const getProjectBgColor = (categoryName) => {
        const colors = {
            'Web Development': 'bg-blue-600',
            'Mobile App': 'bg-green-600',
            'UI/UX Design': 'bg-purple-600',
            'E-commerce': 'bg-orange-500',
            'Marketing': 'bg-red-500',
            'Default': 'bg-gray-700'
        };

        return colors[categoryName] || colors['Default'];
    };

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

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                        >
                            <SortDesc size={18} />
                            <span>{getSortLabel()}</span>
                            <ChevronDown size={16} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showSortMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-200">
                                <button
                                    onClick={() => {
                                        setSortBy('newest');
                                        setShowSortMenu(false);
                                    }}
                                    className={`flex items-center w-full text-left px-4 py-2 text-sm ${sortBy === 'newest' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                                >
                                    {sortBy === 'newest' && <Check size={16} className="mr-2" />}
                                    <span className={sortBy === 'newest' ? 'ml-6' : 'ml-0'}>Newest First</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy('price-low');
                                        setShowSortMenu(false);
                                    }}
                                    className={`flex items-center w-full text-left px-4 py-2 text-sm ${sortBy === 'price-low' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                                >
                                    {sortBy === 'price-low' && <Check size={16} className="mr-2" />}
                                    <span className={sortBy === 'price-low' ? 'ml-6' : 'ml-0'}>Price: Low to High</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy('price-high');
                                        setShowSortMenu(false);
                                    }}
                                    className={`flex items-center w-full text-left px-4 py-2 text-sm ${sortBy === 'price-high' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                                >
                                    {sortBy === 'price-high' && <Check size={16} className="mr-2" />}
                                    <span className={sortBy === 'price-high' ? 'ml-6' : 'ml-0'}>Price: High to Low</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy('title');
                                        setShowSortMenu(false);
                                    }}
                                    className={`flex items-center w-full text-left px-4 py-2 text-sm ${sortBy === 'title' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                                >
                                    {sortBy === 'title' && <Check size={16} className="mr-2" />}
                                    <span className={sortBy === 'title' ? 'ml-6' : 'ml-0'}>Title</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Filter Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                        >
                            <Filter size={18} />
                            <span>Filters</span>
                            <ChevronDown size={16} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showFilterMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="number"
                                        min="0"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                        className="w-24 border border-gray-300 rounded px-2 py-1"
                                    />
                                    <span>to</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                                        className="w-24 border border-gray-300 rounded px-2 py-1"
                                    />
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => {
                                            setPriceRange([0, 10000]);
                                            setShowFilterMenu(false);
                                        }}
                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 mr-2"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setShowFilterMenu(false)}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
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
                    <p className="text-gray-600 mb-6">
                        {searchQuery || selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 10000
                            ? "Try adjusting your search or filters to find what you're looking for."
                            : "Get started by creating your first project or adding categories."}
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
                        viewMode === 'grid' ? (
                            <ProjectCard
                                key={project.id || idx}
                                category={project.categoryName}
                                title={project.title}
                                subtitle="Project Hub"
                                description={project.description}
                                price={project.price}
                                image={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                bg={getProjectBgColor(project.categoryName)}
                                status={project.status || 'active'}
                                date={project.createdAt ? new Date(project.createdAt).toLocaleDateString() : undefined}
                                rating={4.5}
                                reviewCount={12}
                                onClick={() => navigate(`/admin/project/${project.id}`)}
                            />
                        ) : (
                            <div
                                key={project.id || idx}
                                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/admin/project/${project.id}`)}
                            >
                                <div className="w-32 h-32 flex-shrink-0">
                                    <img
                                        src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "/placeholder.svg?height=128&width=128";
                                        }}
                                    />
                                </div>
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getProjectBgColor(project.categoryName).replace('bg-', 'bg-').replace('-600', '-100').replace('-500', '-100')
                                                } ${getProjectBgColor(project.categoryName).replace('bg-', 'text-').replace('-600', '-800').replace('-500', '-800')
                                                }`}>
                                                {project.categoryName}
                                            </span>
                                            <h3 className="font-bold text-gray-900 mt-1">{project.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{project.description}</p>
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">${project.price}</div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                                project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {project.status || 'Active'}
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'No date'}</span>
                                        </div>
                                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                            <FaEllipsisV size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
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

// Add this to your CSS or in a style tag
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
`;

export default AdminProjects;