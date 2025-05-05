import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from '../../utils/axiosInstance';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        previewVideoUrl: '',
        price: ''
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) return setError("Unauthorized. Please login.");

            try {
                const res = await axios.get(`http://localhost:8080/api/seller/project/details/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = res.data.data;
                setProject(data);
                setForm({
                    title: data.title || '',
                    description: data.description || '',
                    price: data.price || '',
                    previewVideoUrl: data.previewVideoUrl || ''
                });
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch project details.");
                setLoading(false);
                console.error(err);
            }
        };

        fetchProjectDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert("Unauthorized");

        setIsSubmitting(true);
        try {
            await axios.patch(`http://localhost:8080/api/seller/project/update/${id}`, {
                title: form.title,
                description: form.description,
                previewVideoUrl: form.previewVideoUrl,
                price: Number(form.price)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setNotification({ type: 'success', message: 'Project updated successfully!' });
            setTimeout(() => setNotification(null), 3000);
        } catch (err) {
            console.error(err);
            setNotification({ type: 'error', message: 'Failed to update project' });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleThumbnailUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!thumbnailFile || !token) return alert("Please select a file");

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', thumbnailFile);

        try {
            await axios.patch(`http://localhost:8080/api/seller/project/${id}/thumbnail`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setNotification({ type: 'success', message: 'Thumbnail updated successfully!' });
            setTimeout(() => setNotification(null), 3000);
        } catch (err) {
            console.error(err);
            setNotification({ type: 'error', message: 'Failed to update thumbnail' });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center justify-between max-w-md animate-fade-in ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                    notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
                        'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
                    }`}>
                    <div className="flex items-center">
                        <p>{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="ml-4 text-gray-500 hover:text-gray-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-600 border-opacity-30" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-24">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Error</h2>
                        <p className="text-center text-gray-600">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-6 w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-300"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto">
                    <button
                        className="group mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
                        onClick={() => navigate(-1)}
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Projects
                    </button>

                    {/* Main Form */}
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800">Edit Project</h2>
                            <p className="mt-1 text-sm text-gray-500">Update your project information and thumbnail</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter project title"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors duration-300"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">$</span>
                                    </div>
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="previewVideoUrl" className="block text-sm font-medium text-gray-700 mb-1">Preview Video URL</label>
                                <input
                                    id="previewVideoUrl"
                                    type="text"
                                    name="previewVideoUrl"
                                    value={form.previewVideoUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors"
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Project'}
                            </button>
                        </div>
                    </div>

                    {/* Thumbnail Section */}
                    <div className="mt-8 bg-white shadow-sm rounded-xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800">Project Thumbnail</h3>
                            <p className="mt-1 text-sm text-gray-500">Upload a high-quality image</p>
                        </div>

                        <div className="p-6 flex flex-col md:flex-row gap-6">
                            {project.thumbnail && (
                                <div className="w-48 h-48 rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                        src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                        alt="Thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                    <p className="mt-2 text-xs text-gray-500 text-center">Current thumbnail</p>
                                </div>
                            )}

                            <div className="flex-grow">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        id="thumbnail"
                                        accept="image/*"
                                        onChange={(e) => setThumbnailFile(e.target.files[0])}
                                        className="hidden"
                                    />
                                    <label htmlFor="thumbnail" className="cursor-pointer block">
                                        <p className="text-sm text-gray-600">{thumbnailFile ? thumbnailFile.name : 'Click to upload'}</p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                                    </label>
                                </div>

                                <button
                                    onClick={handleThumbnailUpdate}
                                    disabled={!thumbnailFile || isUploading}
                                    className={`w-full mt-4 py-3 px-4 rounded-lg text-white font-medium ${!thumbnailFile || isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}
                                >
                                    {isUploading ? 'Uploading...' : 'Update Thumbnail'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Project Info */}
                    <div className="mt-8 bg-white shadow-sm rounded-xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800">Project Details</h3>
                        </div>
                        <div className="p-6 space-y-4 text-gray-700">
                            {project.category && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Category</h4>
                                    <p className="text-base">{project.category.name}</p>
                                </div>
                            )}

                            {project.tags && project.tags.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {project.tags.map(tag => (
                                            <span key={tag.id} className="px-2 py-1 text-sm bg-gray-100 border border-gray-300 rounded-full">
                                                {tag.tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.photos && project.photos.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Project Photos</h4>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {project.photos.map(photo => (
                                            <div key={photo.id} className="w-32">
                                                <img
                                                    src={`http://localhost:8080/api/media/photo?file=${photo.path}`}
                                                    alt={photo.caption}
                                                    className="rounded-lg border border-gray-200 object-cover w-full h-24"
                                                />
                                                <p className="mt-1 text-xs text-center">{photo.caption}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Visibility</h4>
                                <p className={`inline-block mt-1 px-2 py-1 rounded-md text-sm font-semibold ${project.visible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {project.visible ? 'Public' : 'Private'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ProjectDetail;
