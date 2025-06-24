import React, { useState } from "react";
import { ShoppingBag, Star, Tag, ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const UserProjectDetailHelper = ({ project, isExpanded, setIsExpanded, onRequestBuy, setSelectedProject }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(null);
    const PHOTOS_PER_PAGE = 3;

    const [galleryIndex, setGalleryIndex] = useState(0); // for gallery scroll

    const visiblePhotos = project.photos.slice(
        galleryIndex * PHOTOS_PER_PAGE,
        (galleryIndex + 1) * PHOTOS_PER_PAGE
    );

    const canGoPrev = galleryIndex > 0;
    const canGoNext = (galleryIndex + 1) * PHOTOS_PER_PAGE < project.photos.length;



    const selectedPhoto = currentIndex !== null ? project.photos[currentIndex] : null;

    const showPrev = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    const showNext = () => {
        if (currentIndex < project.photos.length - 1) setCurrentIndex((prev) => prev + 1);
    };

    return (
        <div className="space-y-12">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                {/* Left Content */}
                <div className="flex-1 space-y-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-[var(--text-color)]">
                            {project.title}
                        </h1>
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

                    {/* Tags */}
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

                {/* Right Card */}
                <div className="rounded-xl shadow-lg p-4 w-full lg:w-70 bg-[var(--hover-bg)] border border-[var(--border-color)] space-y-6">
                    {/* Thumbnail */}
                    <div>
                        <img
                            src={`${API_URL}/media/photo?file=${project.thumbnail}`}
                            alt={project.title}
                            className="w-full h-40 object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Price & Buy */}
                    <div className="space-y-4 sm:space-y-5">
                        <div className="space-y-1">
                            <div className="flex items-baseline justify-between">
                                <p className="text-xl sm:text-3xl font-bold text-[var(--button-primary)]">
                                    NPR {project.price}
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                className="w-full bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
                                onClick={() => {
                                    setSelectedProject(project);
                                    onRequestBuy();
                                }}
                            >
                                Request to Buy
                            </button>
                            <div className="flex items-center gap-4 mt-5">
                                <img
                                    src={`${API_URL}/media/photo?file=${project.seller.photo || "default.jpg"}`}
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



            {/* Gallery Section */}
            {/* Gallery Section */}
            {project.photos?.length > 0 && (
                <div className="relative">
                    <h2 className="flex items-center text-xl font-semibold mb-4 mt-6">
                        <ImageIcon className="h-5 w-5 mr-2" />
                        Gallery
                    </h2>

                    <div className="relative">
                        {/* Carousel Container */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visiblePhotos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className="group relative cursor-pointer"
                                    onClick={() => setCurrentIndex(galleryIndex * PHOTOS_PER_PAGE + index)}
                                >
                                    <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-md">
                                        <img
                                            src={`${API_URL}/media/photo?file=${photo.path}`}
                                            alt={photo.caption || "Project Photo"}
                                            className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity duration-200"
                                        />
                                    </div>
                                    {photo.caption && (
                                        <p className="text-sm mt-2 px-1 font-medium">{photo.caption}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Left Arrow */}
                        {canGoPrev && (
                            <button
                                onClick={() => setGalleryIndex((prev) => prev - 1)}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}

                        {/* Right Arrow */}
                        {canGoNext && (
                            <button
                                onClick={() => setGalleryIndex((prev) => prev + 1)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {selectedPhoto && (
                        <>
                            <div className="fixed inset-0 z-40 backdrop-blur-sm"></div>

                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <div className="relative w-[75%] max-w-4xl max-h-[90vh] overflow-auto rounded-xl shadow-lg bg-white">
                                    <img
                                        src={`${API_URL}/media/photo?file=${selectedPhoto.path}`}
                                        alt={selectedPhoto.caption || "Full View"}
                                        className="w-full h-auto object-contain rounded-xl"
                                    />

                                    {/* Close Button */}
                                    <button
                                        onClick={() => setCurrentIndex(null)}
                                        className="absolute top-2 right-2 bg-white text-black rounded-full p-1 shadow hover:bg-gray-100 transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    {/* Prev Button */}
                                    {currentIndex > 0 && (
                                        <button
                                            onClick={showPrev}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                    )}

                                    {/* Next Button */}
                                    {currentIndex < project.photos.length - 1 && (
                                        <button
                                            onClick={showNext}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                </div>
            )}

        </div>
    );
};

export default UserProjectDetailHelper;
