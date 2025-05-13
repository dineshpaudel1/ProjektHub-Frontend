// src/pages/Admin/EditProject.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import {
    Loader,
    ArrowLeft,
    Tag,
    ImageIcon,
    MessageCircle,
    ShoppingBag,
    Star,
} from "lucide-react";

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

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/public/project/${id}`);
                setProject(res.data.data);
            } catch (err) {
                setError("Failed to load project details.");
                console.error("❌ Error fetching project:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`/public/project/${id}/interactions`);
                setQuestions(res.data.data || []);
            } catch (err) {
                console.error("Error fetching questions:", err);
            }
        };

        fetchProjectDetails();
        fetchQuestions();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin h-12 w-12 text-[var(--button-primary)]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="p-6 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg max-w-md text-center shadow-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!project) return null;

    const embedUrl = getEmbedUrl(project.previewVideoUrl);

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-all duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[var(--text-secondary)] hover:text-[var(--button-primary)] transition-colors duration-200 font-medium"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        <span>Back to Projects</span>
                    </button>
                </div>

                <div className="rounded-2xl shadow-lg overflow-hidden bg-[var(--menu-bg)] border border-[var(--border-color)]">
                    {/* Video */}
                    <div className="relative h-96 w-full bg-black">
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                className="absolute top-0 left-0 w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Project preview"
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <span>Video preview not available</span>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
                                Featured
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                            {/* Left */}
                            <div className="flex-1 space-y-6">
                                <div>
                                    <h1 className="text-4xl font-bold mb-3 text-[var(--text-color)]">{project.title}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="ml-2 text-[var(--text-secondary)] font-medium">(128)</span>
                                        </div>
                                        <div className="flex items-center text-green-600 font-medium">
                                            <ShoppingBag className="h-4 w-4 mr-1" />
                                            1,234 purchases
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[var(--text-secondary)] mb-2">
                                            {isExpanded
                                                ? project.description
                                                : `${project.description?.slice(0, 80)}...`}
                                        </p>
                                        {project.description?.length > 80 && (
                                            <button
                                                className="text-[var(--button-primary)] font-medium hover:underline"
                                                onClick={() => setIsExpanded(!isExpanded)}
                                            >
                                                {isExpanded ? "Show less" : "Read more"}
                                            </button>
                                        )}
                                    </div>
                                </div>

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
                                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--button-primary)] bg-opacity-10 text-white"
                                                >
                                                    #{tag.tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right */}
                            {/* Right */}
                            <div className="rounded-xl shadow-lg p-6 w-full lg:w-80 bg-[var(--hover-bg)] border border-[var(--border-color)]">
                                {/* Thumbnail Image */}
                                <div className="mb-4">
                                    <img
                                        src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                        alt={project.title}
                                        className="w-full h-40 object-cover rounded-lg shadow-md"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex items-baseline justify-between">
                                            <p className="text-3xl font-bold text-[var(--button-primary)]">NPR {project.price}.99</p>
                                            <p className="text-sm line-through text-gray-500">NPR 2999.99</p>
                                        </div>
                                        <p className="text-green-600 text-sm font-bold">33% OFF</p>
                                    </div>
                                    <p className="text-xs text-center text-[var(--text-secondary)]">
                                        Listed by: <strong>{project.sellerName}</strong>
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Gallery */}
                        {/* Gallery */}
                        {project.photos?.length > 0 && (
                            <div className="mt-12">
                                <h2 className="flex items-center text-xl font-semibold mb-4">
                                    <ImageIcon className="h-5 w-5 mr-2" />
                                    Gallery
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {project.photos.map((photo) => (
                                        <div key={photo.id} className="group relative">
                                            <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-md">
                                                <img
                                                    src={`http://localhost:8080/api/media/photo?file=${photo.path}`}
                                                    alt={photo.caption || "Project Photo"}
                                                    className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity duration-200"
                                                />
                                            </div>
                                            {photo.caption && <p className="text-sm mt-2 px-1 font-medium">{photo.caption}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Q&A Section */}
                        {questions.length > 0 && (
                            <div className="mt-12">
                                <h2 className="flex items-center text-xl font-semibold mb-4">
                                    <MessageCircle className="h-5 w-5 mr-2" />
                                    Questions & Answers
                                </h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {questions.map((q, idx) => {
                                        const askedDate = new Date(q.createdAt).toLocaleString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        });
                                        return (
                                            <li
                                                key={idx}
                                                className="bg-[var(--hover-bg)] border border-[var(--border-color)] p-4 rounded-lg text-sm shadow-md space-y-2"
                                            >
                                                <div>
                                                    <p className="font-medium text-[var(--text-color)]">Q: {q.questionText}</p>
                                                    <p className="text-xs text-gray-500">Asked by: {q.askedBy} on {askedDate}</p>
                                                </div>
                                                {q.answerText ? (
                                                    <div className="mt-2 border-t pt-2 border-gray-300 dark:border-gray-600">
                                                        <p className="font-medium text-[var(--button-primary-hover)]">A: {q.answerText}</p>
                                                        <p className="text-xs text-gray-500">Answered by: {q.answeredBy}</p>
                                                    </div>
                                                ) : (
                                                    <p className="italic text-yellow-500 text-xs">Answer pending...</p>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProject;
