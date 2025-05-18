"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { Loader, ArrowLeft, MessageCircle } from "lucide-react";
import SocialModal from "../../modals/SocialModal";
import NotificationToast from "../../components/NotificationToast";
import UserQuestionAnswerList from "../../components/UserHelper/QuestionAnswerList";
import UserProjectDetailHelper from "../../components/UserHelper/UserProjectDetailHelper";
import UserGallerySection from "../../components/UserHelper/UserGallerySection";

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

const UserProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [questionText, setQuestionText] = useState("");
    const [questions, setQuestions] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [notification, setNotification] = useState(null);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`/public/project/${id}/interactions`);
            setQuestions(res.data.data || []);
        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!questionText.trim()) return;

        const token = localStorage.getItem("accessToken");

        if (!token) {
            setNotification({ type: "error", message: "Please login to ask a question." });
            localStorage.setItem("redirectAfterLogin", `/project/${id}`);

            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }

        try {
            await axios.post(
                `/user/interactions/question`,
                { projectId: id, questionText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuestionText("");
            fetchQuestions();
        } catch (err) {
            console.error("Error submitting question:", err);
        }
    };

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/public/project/${id}`);
                setProject(response.data.data);
            } catch (err) {
                console.error("❌ Error fetching project details:", err);
                setError("Failed to load project details.");
            } finally {
                setLoading(false);
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
        <>
            <NotificationToast
                notification={notification}
                onClose={() => setNotification(null)}
            />

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

                        <div className="p-8">
                            {/* Project Info (Title, Rating, Price, Description, Tags, Sidebar) */}
                            <UserProjectDetailHelper
                                project={project}
                                isExpanded={isExpanded}
                                setIsExpanded={setIsExpanded}
                                onRequestBuy={() => setIsModalOpen(true)}
                            />

                            {/* Gallery */}
                            <UserGallerySection photos={project.photos} />

                            {/* Ask a Question */}
                            <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
                                <h2 className="flex items-center text-xl font-semibold mb-4">
                                    <MessageCircle className="h-5 w-5 mr-2" />
                                    Ask a Question
                                </h2>

                                {/* Ask Form */}
                                <form onSubmit={handleAskQuestion} className="mb-6">
                                    <textarea
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                        placeholder="Type your question..."
                                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] bg-transparent resize-none min-h-[120px]"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                                    >
                                        Submit Question
                                    </button>
                                </form>

                                {/* Previous Questions */}
                                <UserQuestionAnswerList questions={questions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SocialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default UserProjectDetail;
