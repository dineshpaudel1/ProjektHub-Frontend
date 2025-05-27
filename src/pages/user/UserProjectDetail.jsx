import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { Loader, MessageCircle } from "lucide-react";
import UserQuestionAnswerList from "../../components/UserHelper/QuestionAnswerList";
import UserProjectDetailHelper from "../../components/UserHelper/UserProjectDetailHelper";
import UserGallerySection from "../../components/UserHelper/UserGallerySection";
import { useProjectContext } from "../../context/ProjectContext";
import OrderModal from "../../modals/OrderModal";
import { notifySuccess, notifyError } from '../../utils/toastNotify';

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

    const {
        projectDetail: project,
        loadingDetail: loading,
        fetchProjectDetail,
        fetchQuestions,
        loadingQuestions,
        questions,
        setSelectedProject,
    } = useProjectContext();

    const [questionText, setQuestionText] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);


    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!questionText.trim()) return;

        const token = localStorage.getItem("token");

        if (!token) {
            notifyError("Please Login to Ask a Question");
            localStorage.setItem("redirectAfterLogin", `/project/${id}`);
            setTimeout(() => navigate("/login"));
            return;
        }

        try {
            await axios.post(
                `/user/interactions/question`,
                { projectId: id, questionText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuestionText("");
            fetchQuestions(id);
        } catch (err) {
            notifyError("Error Submitting question");
        }
    };

    useEffect(() => {
        fetchProjectDetail(id);
        fetchQuestions(id);
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin h-12 w-12 text-[var(--button-primary)]" />
            </div>
        );
    }

    if (!loading && !project) {
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
        <>
            <div className="min-h-screen py-[100px] px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-all duration-300 ease-in-out">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-2xl shadow-lg overflow-hidden bg-[var(--menu-bg)] border border-[var(--border-color)]">
                        {/* Video Preview */}
                        <div className="relative w-full h-[400px] bg-black">
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


                        <div className="p-4 sm:p-6 lg:p-8">

                            {/* Project Info */}
                            <UserProjectDetailHelper
                                project={project}
                                isExpanded={isExpanded}
                                setIsExpanded={setIsExpanded}
                                setSelectedProject={setSelectedProject}
                                onRequestBuy={() => {
                                    const token = localStorage.getItem("token");
                                    if (!token) {
                                        notifyError("Before Placing Order Please login");;
                                        navigate("/login");
                                        return;
                                    }
                                    setSelectedProject(project);
                                    setIsOrderModalOpen(true);

                                }}
                            />


                            {/* Gallery */}
                            <UserGallerySection photos={project.photos} />

                            {/* Ask a Question */}
                            <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
                                <h2 className="flex items-center text-xl font-semibold mb-4">
                                    <MessageCircle className="h-5 w-5 mr-2" />
                                    Ask a Question
                                </h2>

                                <form onSubmit={handleAskQuestion} className="mb-6">
                                    <textarea
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                        placeholder="Type your question..."
                                        className="px-3 py-2 sm:px-4 sm:py-3 w-full border border-[var(--border-color)] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] bg-transparent resize-none min-h-[120px]"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                                    >
                                        Submit Question
                                    </button>
                                </form>

                                {loadingQuestions ? (
                                    <p className="text-sm text-gray-500">Loading questions...</p>
                                ) : (
                                    <UserQuestionAnswerList questions={questions} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />

        </>
    );
};

export default UserProjectDetail;
