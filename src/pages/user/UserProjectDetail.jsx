import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import UserProjectDetailHelper from "../../components/user/UserHelper/UserProjectDetailHelper";
import UserQuestionAnswerList from "../../components/user/UserHelper/QuestionAnswerList";   // ⬅️ new
import OrderModal from "../../modals/OrderModal";
import { useProjectContext } from "../../context/ProjectContext";
import { notifyError } from "../../utils/toastNotify";

const getEmbedUrl = (url) => {
    try {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
        return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
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
        setSelectedProject,
    } = useProjectContext();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    /* ───────── Fetch once ───────── */
    useEffect(() => { fetchProjectDetail(id); }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="animate-spin h-12 w-12 text-[var(--button-primary)]" />
        </div>
    );

    if (!project) return (
        <div className="flex items-center justify-center h-screen">
            <div className="p-6 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg shadow-lg">
                Failed to load project details.
            </div>
        </div>
    );

    const embedUrl = getEmbedUrl(project.previewVideoUrl);

    return (
        <>
            <div className="min-h-screen py-[100px] px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)]">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-2xl shadow-lg overflow-hidden bg-[var(--menu-bg)] border border-[var(--border-color)]">

                        {/* Video preview */}
                        <div className="relative w-full h-[400px] bg-black">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    className="absolute inset-0 w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Project preview"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <span>Video preview not available</span>
                                </div>
                            )}
                            <span className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                Featured
                            </span>
                        </div>

                        <div className="p-4 sm:p-6 lg:p-8">
                            {/* Main project info */}
                            <UserProjectDetailHelper
                                project={project}
                                isExpanded={isExpanded}
                                setIsExpanded={setIsExpanded}
                                setSelectedProject={setSelectedProject}
                                onRequestBuy={() => {
                                    if (!localStorage.getItem("token")) {
                                        notifyError("Please login before placing an order.");
                                        navigate("/login");
                                        return;
                                    }
                                    setSelectedProject(project);
                                    setIsOrderModalOpen(true);
                                }}
                            />

                            {/* Q & A – extracted into its own component */}
                            <UserQuestionAnswerList projectId={id} />
                        </div>
                    </div>
                </div>
            </div>

            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
            />
        </>
    );
};

export default UserProjectDetail;
