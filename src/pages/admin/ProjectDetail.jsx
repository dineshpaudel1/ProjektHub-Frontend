import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

            alert("✅ Project updated successfully!");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to update project");
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
            alert("✅ Thumbnail updated!");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to update thumbnail");
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
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
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    className="group mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
                    onClick={() => navigate(-1)}
                >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Projects
                </button>

                <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h2 className="text-2xl font-semibold text-gray-800">Edit Project</h2>
                        <p className="mt-1 text-sm text-gray-500">Update your project information and thumbnail</p>
                    </div>

                    <div className="p-6">
                        <div className="space-y-6">
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
                                    placeholder="Describe your project"
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors duration-300 resize-none"
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
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors duration-300"
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
                                    placeholder="https://example.com/video"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors duration-300"
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors duration-300 ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-900'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : 'Update Project'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white shadow-sm rounded-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800">Project Thumbnail</h3>
                        <p className="mt-1 text-sm text-gray-500">Upload a high-quality image to represent your project</p>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                            {project.thumbnail && (
                                <div className="flex-shrink-0">
                                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                            alt="Current Thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 text-center">Current thumbnail</p>
                                </div>
                            )}

                            <div className="flex-grow space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        id="thumbnail"
                                        accept="image/*"
                                        onChange={(e) => setThumbnailFile(e.target.files[0])}
                                        className="hidden"
                                    />
                                    <label htmlFor="thumbnail" className="cursor-pointer">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {thumbnailFile ? thumbnailFile.name : 'Click to upload a new thumbnail'}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </label>
                                </div>

                                <button
                                    onClick={handleThumbnailUpdate}
                                    disabled={!thumbnailFile || isUploading}
                                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors duration-300 ${!thumbnailFile || isUploading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-900'
                                        }`}
                                >
                                    {isUploading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                        </span>
                                    ) : 'Update Thumbnail'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;