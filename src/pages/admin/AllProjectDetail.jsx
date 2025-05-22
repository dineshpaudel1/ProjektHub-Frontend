"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, ArrowLeft, MessageCircle } from "lucide-react";
import { useProjectContext } from "../../context/ProjectContext";

import UserProjectDetailHelper from "../../components/UserHelper/UserProjectDetailHelper";
import UserGallerySection from "../../components/UserHelper/UserGallerySection";
import UserQuestionAnswerList from "../../components/UserHelper/QuestionAnswerList";

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

    const {
        projectDetail: project,
        loadingDetail,
        fetchProjectDetail,
        fetchQuestions,
        loadingQuestions,
        questions,
    } = useProjectContext();

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        fetchProjectDetail(id);
        fetchQuestions(id);
    }, [id]);

    if (loadingDetail) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin h-12 w-12 text-[var(--button-primary)]" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="p-6 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg max-w-md text-center shadow-lg">
                    Failed to load project details.
                </div>
            </div>
        );
    }

    const embedUrl = getEmbedUrl(project.previewVideoUrl);

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-all duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[var(--text-secondary)] hover:text-[var(--button-primary)] transition-colors duration-200 font-medium"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        <span>Back to Projects</span>
                    </button>
                </div>

                {/* Main Card */}
                <div className="rounded-2xl shadow-lg overflow-hidden bg-[var(--menu-bg)] border border-[var(--border-color)]">
                    {/* Video Preview */}
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

                    {/* Content Section */}
                    <div className="p-8">
                        <UserProjectDetailHelper
                            project={project}
                            isExpanded={isExpanded}
                            setIsExpanded={setIsExpanded}
                            onRequestBuy={null} // Admins don't need this, pass null or skip
                        />

                        {/* Gallery */}
                        <UserGallerySection photos={project.photos} />

                        {/* Q&A Section */}
                        <div className="mt-10 pt-8 border-t border-[var(--border-color)]">


                            {loadingQuestions ? (
                                <p className="text-sm text-gray-400">Loading questions...</p>
                            ) : (
                                <UserQuestionAnswerList questions={questions} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProjectDetail;
