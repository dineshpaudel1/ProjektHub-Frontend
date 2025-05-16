
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

import NotificationToast from '../../porjectdetailhelper/NotificationToast';
import ThumbnailUpload from '../../porjectdetailhelper/ThumbnailUpload';
import PhotoGallery from '../../porjectdetailhelper/PhotoGallery';
import PhotoUploadModal from '../../porjectdetailhelper/PhotoUploadModal';
import TagSection from '../../porjectdetailhelper/TagSection';

const EditMyProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', previewVideoUrl: '', price: '' });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [notification, setNotification] = useState(null);

    const [newTag, setNewTag] = useState('');
    const [isTagSubmitting, setIsTagSubmitting] = useState(false);

    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoCaption, setPhotoCaption] = useState('');
    const [isPhotoUploading, setIsPhotoUploading] = useState(false);

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
        } catch (err) {
            console.error(err);
            setError("Failed to fetch project details.");
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchProjectDetails().finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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
            await fetchProjectDetails();
        } catch (err) {
            console.error(err);
            setNotification({ type: 'error', message: 'Failed to update project' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setNotification(null), 3000);
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
            await fetchProjectDetails();
        } catch (err) {
            console.error(err);
            setNotification({ type: 'error', message: 'Failed to update thumbnail' });
        } finally {
            setIsUploading(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleAddTag = async () => {
        if (!newTag.trim()) return;
        setIsTagSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:8080/api/seller/project/addTags/${id}`, {
                tag: [newTag]
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setNewTag('');
            setNotification({ type: 'success', message: 'Tag added successfully!' });
            await fetchProjectDetails();
        } catch (err) {
            console.error(err);
            setNotification({ type: 'error', message: 'Failed to add tag.' });
        } finally {
            setIsTagSubmitting(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handlePhotoUpload = async () => {
        if (!photoFile || !photoCaption) return;
        setIsPhotoUploading(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('files', photoFile); // key name must be `files`
        formData.append(
            'data',
            JSON.stringify({ captions: [photoCaption] }) // JSON string for `data`
        );

        try {
            await axios.post(`http://localhost:8080/api/seller/project/${id}/photos/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPhotoFile(null);
            setPhotoCaption('');
            setShowPhotoModal(false);
            setNotification({ type: 'success', message: 'Photo uploaded!' });
            await fetchProjectDetails();
        } catch (err) {
            console.error(err);
            setNotification({ type: 'error', message: 'Failed to upload photo.' });
        } finally {
            setIsPhotoUploading(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <NotificationToast notification={notification} onClose={() => setNotification(null)} />

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-600 border-opacity-30" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-24">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
                        <p className="text-gray-600">{error}</p>
                        <button onClick={() => navigate(-1)} className="mt-6 w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                            Go Back
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => navigate(-1)} className="mb-6 text-gray-600 hover:text-gray-900">
                        ← Back to Projects
                    </button>

                    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800">Edit Project</h2>
                            <p className="mt-1 text-sm text-gray-500">Update your project information and thumbnail</p>
                        </div>
                        <ThumbnailUpload
                            project={project}
                            thumbnailFile={thumbnailFile}
                            setThumbnailFile={setThumbnailFile}
                            handleThumbnailUpdate={handleThumbnailUpdate}
                            isUploading={isUploading}
                        />
                    </div>

                    <div className="bg-white shadow-sm rounded-xl overflow-hidden mt-8 p-6 space-y-6">
                        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                        <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                        <input name="previewVideoUrl" value={form.previewVideoUrl} onChange={handleChange} placeholder="Video URL" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                        <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="Price" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                        <button onClick={handleUpdate} disabled={isSubmitting} className="w-full py-2 px-4 bg-black text-white rounded-md">
                            {isSubmitting ? 'Updating...' : 'Update Project'}
                        </button>
                    </div>

                    <div className="bg-white shadow-sm rounded-xl overflow-hidden mt-8 p-6 space-y-6">
                        <p><strong>Category:</strong> {project.category?.name}</p>
                        <TagSection
                            project={project}
                            setProject={setProject}
                            newTag={newTag}
                            setNewTag={setNewTag}
                            handleAddTag={handleAddTag}
                            isTagSubmitting={isTagSubmitting}
                            setNotification={setNotification}
                        />
                        <PhotoGallery
                            project={project}
                            setProject={setProject}
                            setShowPhotoModal={setShowPhotoModal}
                            setNotification={setNotification}
                        />

                        <p><strong>Visibility:</strong> <span className={`px-2 py-1 rounded ${project.visible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{project.visible ? 'Public' : 'Private'}</span></p>
                    </div>

                    <PhotoUploadModal
                        show={showPhotoModal}
                        onClose={() => setShowPhotoModal(false)}
                        onUpload={handlePhotoUpload}
                        isUploading={isPhotoUploading}
                        photoFile={photoFile}
                        setPhotoFile={setPhotoFile}
                        photoCaption={photoCaption}
                        setPhotoCaption={setPhotoCaption}
                    />
                </div>
            )}
        </div>
    );
};

export default EditMyProject;
