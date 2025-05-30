import React, { useState } from "react";
import { ShoppingBag, Star, Pencil, UploadCloud, Save } from "lucide-react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const ProjectDetailsSection = ({ project, setProject, isExpanded, setIsExpanded }) => {
    const [editing, setEditing] = useState({
        title: false,
        description: false,
        price: false,
        video: false,
        deliveryLink: false
    });

    const [form, setForm] = useState({
        title: project.title,
        description: project.description,
        price: project.price,
        previewVideoUrl: project.previewVideoUrl,
        deliveryLink: project.deliveryLink || ""
    });

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const handleFieldChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveField = async (field) => {
        try {
            await axios.patch(`/seller/project/update/${project.id}`, {
                title: form.title,
                description: form.description,
                price: Number(form.price),
                previewVideoUrl: form.previewVideoUrl
            }, { headers });

            setProject(prev => ({ ...prev, ...form, price: Number(form.price) }));
            toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
        } catch (err) {
            console.error("Update failed:", err);
            toast.error(`Failed to update ${field}`);
        } finally {
            setEditing(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleSaveDeliveryLink = async () => {
        try {
            const res = await axios.put(`http://localhost:8080/api/${project.id}/delivery-link`, {
                deliveryLink: form.deliveryLink
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            // ✅ Update local state with the response
            setProject(prev => ({
                ...prev,
                deliveryLink: res.data.data.deliveryLink // use backend-confirmed value
            }));

            toast.success("Delivery link updated successfully!");
        } catch (err) {
            console.error("❌ Delivery link update failed:", err);
            toast.error("Failed to update delivery link");
        } finally {
            setEditing(prev => ({ ...prev, deliveryLink: false }));
        }
    };


    const handleThumbnailUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.patch(`/seller/project/${project.id}/thumbnail`, formData, {
                headers: { ...headers, "Content-Type": "multipart/form-data" }
            });
            toast.success("Thumbnail updated!");
        } catch (err) {
            console.error("Thumbnail update failed:", err);
            toast.error("Thumbnail update failed");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Left Section */}
            <div className="flex-1 space-y-6">
                {/* Title */}
                <div className="flex items-center gap-2">
                    {editing.title ? (
                        <div className="flex items-center gap-2 w-full">
                            <input
                                value={form.title}
                                onChange={(e) => handleFieldChange("title", e.target.value)}
                                className="text-4xl font-bold bg-transparent border-b border-gray-400 text-[var(--text-color)] w-full"
                                autoFocus
                            />
                            <Save className="h-5 w-5 text-green-600 cursor-pointer" onClick={() => handleSaveField("title")} />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-4xl font-bold text-[var(--text-color)]">{project.title}</h1>
                            <Pencil className="h-4 w-4 cursor-pointer text-gray-500" onClick={() => setEditing(prev => ({ ...prev, title: true }))} />
                        </>
                    )}
                </div>

                {/* Ratings + Purchases */}
                <div className="flex flex-wrap items-center gap-4 text-sm mb-4 mt-2">
                    <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                        <span className="ml-2 text-[var(--text-secondary)] font-medium">(128)</span>
                    </div>
                    <div className="flex items-center text-green-600 font-medium">
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        1,234 purchases
                    </div>
                </div>

                {/* Description */}
                <div className="flex gap-2 items-start">
                    {editing.description ? (
                        <div className="flex items-start gap-2 w-full">
                            <textarea
                                value={form.description}
                                onChange={(e) => handleFieldChange("description", e.target.value)}
                                className="w-full bg-transparent border-b border-gray-400 text-[var(--text-secondary)]"
                                rows={3}
                                autoFocus
                            />
                            <Save className="h-5 w-5 text-green-600 cursor-pointer mt-1" onClick={() => handleSaveField("description")} />
                        </div>
                    ) : (
                        <>
                            <p className="text-[var(--text-secondary)] mb-2">
                                {isExpanded ? project.description : `${project.description?.slice(0, 80)}...`}
                            </p>
                            <Pencil className="h-4 w-4 text-gray-500 mt-1 cursor-pointer" onClick={() => setEditing(prev => ({ ...prev, description: true }))} />
                        </>
                    )}
                </div>

                {project.description?.length > 80 && (
                    <button
                        className="text-[var(--button-primary)] font-medium hover:underline"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? "Show less" : "Read more"}
                    </button>
                )}

                {/* Video URL */}
                <div className="flex gap-2 items-center">
                    <span>Enter Video Url:</span>
                    {editing.video ? (
                        <div className="flex items-center gap-2 w-full">
                            <input
                                type="text"
                                value={form.previewVideoUrl}
                                onChange={(e) => handleFieldChange("previewVideoUrl", e.target.value)}
                                className="text-sm font-mono bg-transparent border-b border-gray-400 w-full"
                                autoFocus
                            />
                            <Save className="h-5 w-5 text-green-600 cursor-pointer" onClick={() => handleSaveField("video")} />
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-mono text-[var(--text-secondary)] truncate max-w-xs">
                                {project.previewVideoUrl}
                            </p>
                            <Pencil className="h-4 w-4 text-gray-500 cursor-pointer" onClick={() => setEditing(prev => ({ ...prev, video: true }))} />
                        </>
                    )}
                </div>

                {/* Delivery Link */}
                <div className="flex gap-2 items-center mt-2">
                    <span>Delivery Link:</span>
                    {editing.deliveryLink ? (
                        <div className="flex items-center gap-2 w-full">
                            <input
                                type="text"
                                value={form.deliveryLink}
                                onChange={(e) => handleFieldChange("deliveryLink", e.target.value)}
                                className="text-sm font-mono bg-transparent border-b border-gray-400 w-full"
                                autoFocus
                            />
                            <Save className="h-5 w-5 text-green-600 cursor-pointer" onClick={handleSaveDeliveryLink} />
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-mono text-[var(--text-secondary)] truncate max-w-xs">
                                {project.deliveryLink || "Not set"}
                            </p>
                            <Pencil className="h-4 w-4 text-gray-500 cursor-pointer" onClick={() => setEditing(prev => ({ ...prev, deliveryLink: true }))} />
                        </>
                    )}
                </div>
            </div>

            {/* Right Section */}
            <div className="rounded-xl shadow-lg p-6 w-full lg:w-80 bg-[var(--hover-bg)] border border-[var(--border-color)]">
                <div className="mb-4 relative group">
                    <img
                        src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                        alt={project.title}
                        className="w-full h-40 object-cover rounded-lg shadow-md"
                    />
                    <label
                        htmlFor="thumbnailUpload"
                        className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-70 transition-opacity rounded-lg cursor-pointer"
                    >
                        <UploadCloud className="h-8 w-8 mb-2" />
                    </label>
                    <input
                        id="thumbnailUpload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleThumbnailUpdate}
                    />
                </div>

                {/* Price */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex items-baseline justify-between gap-2">
                            {editing.price ? (
                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => handleFieldChange("price", e.target.value)}
                                        className="text-3xl font-bold text-[var(--button-primary)] bg-transparent border-b border-gray-400 w-full"
                                        autoFocus
                                    />
                                    <Save className="h-5 w-5 text-green-600 cursor-pointer" onClick={() => handleSaveField("price")} />
                                </div>
                            ) : (
                                <>
                                    <p className="text-3xl font-bold text-[var(--button-primary)]">
                                        NPR {project.price}
                                    </p>
                                    <Pencil className="h-4 w-4 text-gray-500 cursor-pointer" onClick={() => setEditing(prev => ({ ...prev, price: true }))} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsSection;
