import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const ImageModalDisplay = ({ selectedPhoto, setCurrentIndex, currentIndex, photos }) => {
    const showPrev = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    const showNext = () => {
        if (currentIndex < photos.length - 1) setCurrentIndex((prev) => prev + 1);
    };

    if (!selectedPhoto) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30" />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative max-w-4xl w-full max-h-[90vh] rounded-xl overflow-auto shadow-lg"
                    style={{
                        backgroundColor: "var(--bg-color)",
                        border: "1px solid var(--border-color)",
                    }}
                >
                    <img
                        src={`${API_URL}/media/photo?file=${selectedPhoto.path}`}
                        alt={selectedPhoto.caption || "Full View"}
                        className="w-full h-auto object-contain rounded-xl"
                    />

                    {/* Close Button */}
                    <button
                        onClick={() => setCurrentIndex(null)}
                        className="absolute top-2 right-2 p-1 rounded-full border shadow transition hover:scale-105"
                        style={{
                            backgroundColor: "var(--navbar-bg)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-color)",
                        }}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Prev Button */}
                    {currentIndex > 0 && (
                        <button
                            onClick={showPrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full border shadow transition hover:scale-105"
                            style={{
                                backgroundColor: "var(--navbar-bg)",
                                borderColor: "var(--border-color)",
                                color: "var(--text-color)",
                            }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}

                    {/* Next Button */}
                    {currentIndex < photos.length - 1 && (
                        <button
                            onClick={showNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full border shadow transition hover:scale-105"
                            style={{
                                backgroundColor: "var(--navbar-bg)",
                                borderColor: "var(--border-color)",
                                color: "var(--text-color)",
                            }}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ImageModalDisplay;
