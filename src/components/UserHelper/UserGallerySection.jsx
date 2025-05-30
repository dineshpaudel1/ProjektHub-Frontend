import React from "react";
import { ImageIcon } from "lucide-react";

const UserGallerySection = ({ photos }) => {
    if (!photos || photos.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="flex items-center text-xl font-semibold mb-4">
                <ImageIcon className="h-5 w-5 mr-2" />
                Gallery
            </h2>

            {/* Scrollable row on mobile, grid on sm+ */}
            <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-6 hide-scrollbar">
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className="group relative shrink-0 w-[250px] sm:w-auto"
                    >
                        <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-md">
                            <img
                                src={`http://localhost:8080/api/media/photo?file=${photo.path}`}
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
        </div>
    );
};

export default UserGallerySection;
