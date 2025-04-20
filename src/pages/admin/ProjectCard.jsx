import React, { useState } from 'react';
import { Heart, Share2, MoreVertical, ExternalLink, Clock, Tag, User } from 'lucide-react';

const ProjectCard = ({
    category,
    title,
    subtitle,
    price,
    description,
    image,
    bg,
    status = "active",
    date = "Apr 15, 2023",
    rating = 4.8,
    reviewCount = 24,
    onClick
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showActions, setShowActions] = useState(false);

    // Format price with commas
    const formatPrice = (price) => {
        if (!price) return "$0";
        if (typeof price === 'string' && price.startsWith('$')) return price;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden w-full max-w-sm border border-gray-100 relative group"
            onClick={onClick}
        >
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(status)} capitalize`}>
                    {status}
                </span>
            </div>

            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image || "/placeholder.svg?height=200&width=400"}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLiked(!isLiked);
                            }}
                            className={`p-2 rounded-full ${isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'} transition-colors`}
                            aria-label={isLiked ? "Unlike" : "Like"}
                        >
                            <Heart size={16} fill={isLiked ? "white" : "none"} />
                        </button>
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-colors"
                            aria-label="Share"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>

                    <div className="relative">
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
                            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg py-2 w-36 z-10">
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <ExternalLink size={14} />
                                    View Details
                                </button>
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <User size={14} />
                                    View Author
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                {/* Category & Date */}
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-medium ${bg.replace('bg-', 'text-').replace('-500', '-700')}`}>
                        {category}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                        <Clock size={12} className="mr-1" />
                        {date}
                    </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                {/* Author */}
                <p className="text-gray-600 text-sm mb-3">
                    By <span className="font-medium">{subtitle}</span>
                </p>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {description || "This is project details which is good"}
                </p>

                {/* Divider */}
                <div className="border-t border-gray-100 my-4"></div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                    {/* Price */}
                    <div>
                        <span className="text-xs text-gray-500 block">Price</span>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
                    </div>

                    {/* Rating */}
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

            {/* Colored accent bar at bottom */}
            <div className={`h-1 w-full ${bg}`}></div>
        </div>
    );
};

export default ProjectCard;