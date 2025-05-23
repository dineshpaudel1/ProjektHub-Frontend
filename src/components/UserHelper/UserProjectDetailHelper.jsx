import React from "react";
import { ShoppingBag, Star, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";




const UserProjectDetailHelper = ({ project, isExpanded, setIsExpanded, onRequestBuy }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Left Section */}
            <div className="flex-1 space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-[var(--text-color)]">
                        {project.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                        <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                            <span className="ml-2 text-[var(--text-secondary)] font-medium">(128)</span>
                        </div>
                        <div className="flex items-center text-green-600 font-medium">
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            1,234 purchases
                        </div>
                    </div>
                    <p className="text-[var(--text-secondary)] mb-2">
                        {isExpanded ? project.description : `${project.description?.slice(0, 80)}...`}
                    </p>
                    {project.description?.length > 80 && (
                        <button
                            className="text-[var(--button-primary)] font-medium hover:underline"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? "Show less" : "Read more"}
                        </button>
                    )}
                </div>

                {project.tags?.length > 0 && (
                    <div>
                        <h2 className="flex items-center text-lg font-semibold mb-3">
                            <Tag className="h-5 w-5 mr-2" />
                            Tags
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--button-primary)] bg-opacity-10 text-white"
                                >
                                    #{tag.tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Section */}
            <div className="rounded-xl shadow-lg p-4 w-full lg:w-70 bg-[var(--hover-bg)] border border-[var(--border-color)] space-y-6">
                {/* Seller Info */}


                {/* Project Thumbnail */}
                <div>
                    <img
                        src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                        alt={project.title}
                        className="w-full h-40 object-cover rounded-lg shadow-md"
                    />
                </div>

                {/* Price & Buy */}
                <div className="space-y-4 sm:space-y-5">
                    <div className="space-y-1">
                        <div className="flex items-baseline justify-between">
                            <p className="text-2xl sm:text-3xl font-bold text-[var(--button-primary)]">NPR {project.price}</p>
                            <p className="text-sm line-through text-gray-500">NPR 2999.99</p>
                        </div>
                        <p className="text-green-600 text-sm font-bold">33% OFF</p>
                    </div>

                    <div className="pt-2">
                        <button
                            className="w-full bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
                            onClick={onRequestBuy}
                        >
                            Request to Buy
                        </button>
                        <div className="flex items-center gap-4 mt-5">
                            <img
                                src={`http://localhost:8080/api/media/photo?file=${project.seller.photo || "default.jpg"}`}
                                alt="Seller"
                                className="w-14 h-14 rounded-full object-cover border-2 border-[var(--button-primary)]"
                            />
                            <div>
                                <p className="text-md font-semibold text-[var(--text-color)]">
                                    {project.seller.name || "Seller Name"}
                                </p>
                                <button
                                    className="text-sm text-[var(--button-primary)] hover:underline"
                                    onClick={() => navigate(`/seller/${project.seller.id}`)}
                                >
                                    View Seller Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProjectDetailHelper;
