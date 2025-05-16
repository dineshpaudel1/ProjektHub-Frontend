import React, { useState } from 'react';
import { Trash, MoreVertical, ExternalLink, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';

const ProjectCard = ({
    id,
    category,
    title,
    price,
    image,
    bg,
    status = '',
    date = "Apr 15, 2023",
    rating = 4.8,
    reviewCount = 24,
    onClick
}) => {
    const navigate = useNavigate();
    const [showActions, setShowActions] = useState(false);

    const formatPrice = (price) => {
        if (!price) return "$0";
        if (typeof price === 'string' && price.startsWith('$')) return price;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDelete = async (projectId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Unauthorized. Please login.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/seller/project/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Project deleted successfully.");
            // Optionally: reload the list or trigger parent update
            window.location.reload(); // Simple option, you can use state lifting too
        } catch (err) {
            console.error("❌ Failed to delete project:", err);
            alert("Failed to delete project.");
        }
    };

    return (
        <div
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden w-full max-w-sm border border-gray-100 relative group"
            onClick={onClick}
        >
            <div className="absolute top-4 left-4 z-10">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(status)} capitalize`}>
                    visible
                </span>
            </div>

            <div className="relative h-48 overflow-hidden">
                <img
                    src={image || "/placeholder.svg?height=200&width=400"}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <div className="absolute">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowActions(!showActions);
                            }}
                            className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-colors"
                            aria-label="More options"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {showActions && (
                            <div className="absolute bottom-full left-2 mb-2 bg-white rounded-lg shadow-lg py-2 w-36 z-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/seller/editprojects/${id}`);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <ExternalLink size={14} />
                                    View Details
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(id);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash size={14} />
                                    Delete Project
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-medium ${bg.replace('bg-', 'text-').replace('-500', '-700')}`}>
                        {category}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                        <Clock size={12} className="mr-1" />
                        {date}
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                <div className="border-t border-gray-100 my-4"></div>

                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-xs text-gray-500 block">Price</span>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center mr-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">({reviewCount})</span>
                    </div>
                </div>
            </div>

            <div className={`h-1 w-full ${bg}`}></div>
        </div>
    );
};

export default ProjectCard;
