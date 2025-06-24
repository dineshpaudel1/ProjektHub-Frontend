import React, { useState } from "react";
import { ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";




const UserGallerySection = ({ photos }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [currentIndex, setCurrentIndex] = useState(null);

    const selectedPhoto = currentIndex !== null ? photos[currentIndex] : null;

    const showPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const showNext = () => {
        if (currentIndex < photos.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    if (!photos || photos.length === 0) return null;

    return (
        <div className={selectedPhoto ? "relative overflow-hidden" : ""}>
            <h2 className="flex items-center text-xl font-semibold mb-4">
                <ImageIcon className="h-5 w-5 mr-2" />
                Gallery
            </h2>

            {/* Gallery Grid */}
            <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-6 hide-scrollbar">
                {photos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="group relative shrink-0 w-[250px] sm:w-auto cursor-pointer"
                        onClick={() => setCurrentIndex(index)}
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

            {/* Modal with Blur */}
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
                            {currentIndex < photos.length - 1 && (
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
    );
};

export default UserGallerySection;
