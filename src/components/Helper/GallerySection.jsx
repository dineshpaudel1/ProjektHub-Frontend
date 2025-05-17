import React, { useState } from "react";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import axios from "../../utils/axiosInstance";
import PhotoUploadModal from "../../modals/PhotoUploadModal";
import NotificationToast from "../../porjectdetailhelper/NotificationToast";

const GallerySection = ({ id, photos, refreshProject }) => {
    const [showModal, setShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [incomingFiles, setIncomingFiles] = useState([]);

    const token = localStorage.getItem("token");
    const CaptionWithToggle = ({ caption }) => {
        const [expanded, setExpanded] = useState(false);

        return (
            <div
                className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition duration-200"
            >
                <div className={`overflow-hidden ${expanded ? '' : 'line-clamp-2'}`}>
                    {caption}
                </div>
                {caption.length > 60 && !expanded && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="text-xs underline text-blue-200 mt-1"
                    >
                        Show more
                    </button>
                )}
                {expanded && (
                    <button
                        onClick={() => setExpanded(false)}
                        className="text-xs underline text-blue-200 mt-1"
                    >
                        Show less
                    </button>
                )}
            </div>
        );
    };


    const handleDelete = async (photoId) => {
        try {
            await axios.delete(`/seller/project/${id}/photo/${photoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotification({
                type: "success",
                message: "Photo deleted successfully.",
            });
            if (refreshProject) refreshProject();
        } catch (error) {
            console.error("Failed to delete photo:", error);
            setNotification({
                type: "error",
                message: "Failed to delete photo.",
            });
        } finally {
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleUpload = async (photoDataList) => {
        setIsUploading(true);
        const formData = new FormData();

        try {
            const captions = [];
            for (const { file, caption } of photoDataList) {
                formData.append("files", file);
                captions.push(caption || "");
            }

            formData.append("data", JSON.stringify({ captions }));

            await axios.post(
                `http://localhost:8080/api/seller/project/${id}/photos/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setNotification({
                type: "success",
                message: `${photoDataList.length} photo(s) uploaded successfully.`,
            });

            if (refreshProject) refreshProject();
            setShowModal(false);
        } catch (error) {
            console.error("Upload failed:", error);
            setNotification({
                type: "error",
                message: "Failed to upload photos.",
            });
        } finally {
            setIsUploading(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const openModalWithFiles = (files) => {
        setIncomingFiles(files.map(file => ({ file, caption: "" })));
        setShowModal(true);
    };

    return (
        <div className="mt-12">
            <h2 className="flex items-center text-xl font-semibold mb-4">
                <ImageIcon className="h-5 w-5 mr-2" />
                Gallery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {photos && photos.map((photo) => (
                    <div key={photo.id} className="rounded-xl overflow-hidden shadow-md">
                        <div className="relative group">
                            <img
                                src={`http://localhost:8080/api/media/photo?file=${photo.path}`}
                                alt={photo.caption || "Project Photo"}
                                className="w-full h-30 object-contain bg-white transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm opacity-0 group-hover:opacity-40 transition duration-300" />
                            <button
                                className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition duration-200"
                                onClick={() => handleDelete(photo.id)}
                            >
                                <X size={20} />
                            </button>
                            {photo.caption && (
                                <CaptionWithToggle caption={photo.caption} />
                            )}

                        </div>
                    </div>
                ))}

                {/* Upload Box */}
                <div
                    onClick={() => setShowModal(true)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
                        if (files.length > 0) openModalWithFiles(files);
                    }}
                    className="rounded-xl overflow-hidden shadow-md cursor-pointer bg-white flex flex-col items-center justify-center h-20 w-30 mt-5 transition"
                >
                    <UploadCloud className="h-8 w-8 mb-2 text-gray-600" />
                    <p className="text-xs text-gray-600 mb-0.5">Upload Photos</p>
                </div>
            </div>

            <PhotoUploadModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onUpload={handleUpload}
                isUploading={isUploading}
                defaultPhotos={incomingFiles}
            />

            {notification && (
                <NotificationToast
                    notification={notification}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default GallerySection;
