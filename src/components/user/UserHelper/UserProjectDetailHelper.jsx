import React, { useState } from "react";
import { Tag, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageModalDisplay from "../../../modals/ImageModalDisplay";

const API_URL = import.meta.env.VITE_API_URL;

const UserProjectDetailHelper = ({
    project,
    isExpanded,
    setIsExpanded,
    onRequestBuy,
    setSelectedProject,
}) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(null);
    const isMobile = window.innerWidth <= 640;
    const PHOTOS_PER_PAGE = isMobile ? 1 : 3;
    const [galleryIndex, setGalleryIndex] = useState(0);

    const visiblePhotos = project.photos.slice(
        galleryIndex * PHOTOS_PER_PAGE,
        (galleryIndex + 1) * PHOTOS_PER_PAGE
    );

    const canGoPrev = galleryIndex > 0;
    const canGoNext = (galleryIndex + 1) * PHOTOS_PER_PAGE < project.photos.length;
    const selectedPhoto = currentIndex !== null ? project.photos[currentIndex] : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left Section */}
            <div className="lg:col-span-2 space-y-8">
                {/* Title & Description */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)] mb-2">
                        {project.title}
                    </h1>
                    <p className="text-[var(--text-secondary)] text-base sm:text-lg">
                        {isExpanded
                            ? project.description
                            : `${project.description?.slice(0, 100)}...`}
                    </p>
                    {project.description?.length > 100 && (
                        <button
                            className="mt-1 text-[var(--button-primary)] text-sm font-medium hover:underline"
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
                                    className="px-3 py-1.5 text-sm rounded-full bg-blue-600 text-white font-medium"
                                >
                                    #{tag.tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gallery */}
                {project.photos?.length > 0 && (
                    <div className="relative">
                        <h2 className="flex items-center text-lg font-semibold mb-4 mt-6">
                            <ImageIcon className="h-5 w-5 mr-2" />
                            Gallery
                        </h2>

                        {/* Mobile Slider */}
                        <div className="block sm:hidden overflow-x-auto">
                            <div className="flex gap-4 snap-x snap-mandatory overflow-x-scroll scroll-smooth pb-2">
                                {project.photos.map((photo, index) => (
                                    <div
                                        key={photo.id}
                                        className="snap-start shrink-0 w-64 cursor-pointer"
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        <img
                                            src={`${API_URL}/media/photo?file=${photo.path}`}
                                            alt={photo.caption || "Project Photo"}
                                            className="w-full h-40 object-cover rounded-lg shadow-md"
                                        />
                                        {photo.caption && (
                                            <p className="text-sm mt-2 text-center font-medium text-[var(--text-color)]">
                                                {photo.caption}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Grid with Arrows */}
                        <div className="hidden sm:block">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {visiblePhotos.map((photo, index) => (
                                    <div
                                        key={photo.id}
                                        className="group relative cursor-pointer"
                                        onClick={() => setCurrentIndex(galleryIndex * PHOTOS_PER_PAGE + index)}
                                    >
                                        <img
                                            src={`${API_URL}/media/photo?file=${photo.path}`}
                                            alt={photo.caption || "Project Photo"}
                                            className="w-full h-40 object-cover rounded-xl shadow-md group-hover:opacity-90 transition"
                                        />
                                        {photo.caption && (
                                            <p className="text-sm mt-2 px-1 font-medium">
                                                {photo.caption}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Arrows */}
                            {canGoPrev && (
                                <button
                                    onClick={() => setGalleryIndex(prev => prev - 1)}
                                    className="
      absolute left-0 top-1/2 -translate-y-1/2
      p-2 rounded-full shadow transition-colors
      bg-[var(--menu-bg)] hover:bg-[var(--hover-bg)]
    "
                                >
                                    <ChevronLeft className="w-5 h-5 text-[var(--text-color)]" />
                                </button>
                            )}

                            {canGoNext && (
                                <button
                                    onClick={() => setGalleryIndex(prev => prev + 1)}
                                    className="
      absolute right-0 top-1/2 -translate-y-1/2
      p-2 rounded-full shadow transition-colors
      bg-[var(--menu-bg)] hover:bg-[var(--hover-bg)]
    "
                                >
                                    <ChevronRight className="w-5 h-5 text-[var(--text-color)]" />
                                </button>
                            )}

                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: Buy Section */}
            <div className="w-full sm:max-w-lg rounded-xl bg-[var(--hover-bg)] p-5 shadow-lg border border-[var(--border-color)] space-y-5 mx-auto lg:mx-0">
                <img
                    src={`${API_URL}/media/photo?file=${project.thumbnail}`}
                    alt={project.title}
                    className="w-full h-44 object-cover rounded-lg shadow-sm"
                />

                <div>
                    <p className="text-2xl font-bold text-[var(--button-primary)]">
                        NPR {project.price}
                    </p>
                    <button
                        onClick={() => {
                            setSelectedProject(project);
                            onRequestBuy();
                        }}
                        className="mt-4 w-full py-3 px-4 rounded-lg text-white bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] font-semibold shadow-sm"
                    >
                        Request to Buy
                    </button>
                </div>

                <div className="flex items-center gap-4 mt-5">
                    <img
                        src={`${API_URL}/media/photo?file=${project.seller.photo || "default.jpg"}`}
                        alt="Seller"
                        className="w-14 h-14 rounded-full object-cover border-2 border-[var(--button-primary)]"
                    />
                    <div>
                        <p className="text-md font-semibold text-[var(--text-color)]">
                            {project.seller.name}
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

            <ImageModalDisplay
                selectedPhoto={selectedPhoto}
                setCurrentIndex={setCurrentIndex}
                currentIndex={currentIndex}
                photos={project.photos}
            />
        </div>
    );
};

export default UserProjectDetailHelper;
