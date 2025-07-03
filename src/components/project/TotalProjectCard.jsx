import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const TotalProjectCard = ({ project, onLiveView, onPurchase }) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const goToProjectDetail = () => {
        navigate(`/project/${project.id}`);
    };

    const description = project.description || "Professional project with high-quality implementation.";
    const isLong = description.length > 250;

    return (
        <div
            className="w-full max-w-7xl mx-auto bg-[var(--menu-bg)] text-[var(--text-color)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden transition-all hover:shadow-md"
            onClick={goToProjectDetail}
        >
            <div className="p-6 flex flex-col md:flex-row gap-6 cursor-pointer">
                <div className="w-full md:w-80 h-56 flex-shrink-0">
                    <img
                        src={`${API_URL}/media/photo?file=${project.thumbnail}`}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                        <h3 className="text-2xl font-semibold font-serif">
                            {project.title}
                        </h3>
                        <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                                backgroundColor: "var(--hover-bg)",
                                color: "var(--text-color)",
                            }}
                        >
                            {project.categoryName}
                        </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                            <span className="text-xs text-gray-600">
                                {(project.sellerFullName || project.seller?.name || "?").charAt(0)}
                            </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            {project.sellerFullName || project.seller?.name || "Unknown Seller"}
                        </p>
                    </div>

                    <p className={`mt-3 text-[var(--text-secondary)] ${!isExpanded ? "line-clamp-3" : ""}`}>
                        {description}
                    </p>

                    {isLong && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="mt-1 text-sm text-blue-500 hover:underline"
                        >
                            {isExpanded ? "Show Less" : "Show More"}
                        </button>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onPurchase(project);
                            }}
                            className="px-4 py-2 text-white rounded-md transition-colors"
                            style={{
                                backgroundColor: "var(--button-primary)",
                            }}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = "var(--button-primary-hover)")
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor = "var(--button-primary)")
                            }
                        >
                            Purchase (Rs. {project.price})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalProjectCard;
