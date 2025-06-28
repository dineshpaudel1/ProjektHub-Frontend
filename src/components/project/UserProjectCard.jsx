// src/components/user/UserProjectCard.jsx
import React from "react";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Api = import.meta.env.VITE_API_URL;

const UserProjectCard = ({ project }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/project/${project.id}`)}
            className="flex-shrink-0 w-80 bg-white dark:bg-[var(--bg-color)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
        >
            {/* Image */}
            <div className="relative overflow-hidden">
                <img
                    src={`${Api}/media/photo?file=${project.thumbnail}`}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded-full">
                    NPR {project.price?.toLocaleString() || "3000"}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Info */}
            <div className="p-6">
                <div className="mb-3">
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                        {project.categoryName || "Uncategorized"}
                    </span>
                </div>

                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors truncate line-clamp-1" style={{ color: "var(--text-color)" }}>
                    {project.title}
                </h3>

                <p className="text-sm mb-4 line-clamp-1" style={{ color: "var(--text-secondary)" }}>
                    {project.description || "No description available"}
                </p>

                <div className="flex items-center justify-between text-sm" style={{ color: "var(--text-secondary)" }}>
                    <p className="text-sm  line-clamp-2">
                        By: {project.seller?.name || "Unknown Seller"}
                    </p>
                    <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700">
                        <span className="font-medium">View</span>
                        <ExternalLink className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProjectCard;
