// src/pages/Admin/AllProjectDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { Loader, ArrowLeft } from 'lucide-react';

const getEmbedUrl = (url) => {
    try {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return null;
    } catch {
        return null;
    }
};

const AllProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/public/project/${id}`);
                setProject(response.data.data);
            } catch (err) {
                console.error('❌ Error fetching project details:', err);
                setError('Failed to load project details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin h-12 w-12 text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-600 p-6 bg-red-50 rounded-lg max-w-md text-center">
                    {error}
                </div>
            </div>
        );
    }

    if (!project) return null;

    const embedUrl = getEmbedUrl(project.previewVideoUrl);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        <span className="text-sm font-medium">Back to Projects</span>
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Main Thumbnail */}
                    <div className="relative h-80 w-full">
                        <img
                            src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                    {project.title}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                    <div>
                                        <span className="font-medium">Seller:</span> {project.sellerName}
                                    </div>
                                    <div>
                                        <span className="font-medium">Category:</span> {project.category?.name}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-50 px-4 py-3 rounded-lg">
                                <p className="text-xl font-semibold text-blue-700">NPR {project.price}</p>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-700 mb-8">
                            <p>{project.description}</p>
                        </div>

                        {/* Preview Video */}
                        {embedUrl && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Preview Video</h2>
                                <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        src={embedUrl}
                                        className="absolute top-0 left-0 w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Project preview"
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {project.tags?.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            #{tag.tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Photos */}
                        {project.photos?.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Gallery</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {project.photos.map((photo) => (
                                        <div key={photo.id} className="group relative">
                                            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                                                <img
                                                    src={`http://localhost:8080/api/media/photo?file=${photo.path}`}
                                                    alt={photo.caption || 'Project Photo'}
                                                    className="w-full h-48 sm:h-56 object-cover group-hover:opacity-90 transition-opacity duration-200"
                                                />
                                            </div>
                                            {photo.caption && (
                                                <p className="text-l text-black-600 mt-2 px-1 font-bold">{photo.caption}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProjectDetail;
