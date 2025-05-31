import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { Loader, ArrowLeft } from "lucide-react";
import QuestionAnswerList from "../../components/SellerHelper/QuestionAnswerList";
import ProjectDetailsSection from "../../components/SellerHelper/ProjectDetailsSection";
import GallerySection from "../../components/SellerHelper/GallerySection";
import TagDisplaySection from "../../components/SellerHelper/TagDisplaySection";
import { toast } from "react-toastify";

const SellerProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [isTagSubmitting, setIsTagSubmitting] = useState(false);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`/public/project/${id}/interactions`);
            setQuestions(res.data.data || []);
        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    };

    const fetchProjectDetails = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Unauthorized. Please login.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`/seller/project/details/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProject(res.data.data);
        } catch (err) {
            setError("Failed to load project details.");
            console.error("❌ Error fetching project:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleVisibility = async () => {
        const token = localStorage.getItem("token");
        if (!token || !project) return;

        try {
            await axios.patch(
                `/seller/project/${project.id}/visibility`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setProject((prev) => ({
                ...prev,
                visible: !prev.visible,
            }));

            toast.success(`Project marked as ${!project.visible ? "Public" : "Private"}`);
        } catch (error) {
            console.error("Visibility toggle failed:", error);
            toast.error("Failed to change project visibility.");
        }
    };

    const handleAddTag = async () => {
        if (!newTag.trim()) return;
        const token = localStorage.getItem("token");

        try {
            setIsTagSubmitting(true);
            await axios.post(
                `/seller/project/addTags/${project.id}`,
                { tag: [newTag] },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setProject((prev) => ({
                ...prev,
                tags: [...prev.tags, { id: Date.now(), tag: newTag }],
            }));

            setNewTag("");
            toast.success("Tag added successfully!");
        } catch (err) {
            console.error("Failed to add tag:", err);
            toast.error("Failed to add tag.");
        } finally {
            setIsTagSubmitting(false);
        }
    };

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

    useEffect(() => {
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
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[var(--text-secondary)] hover:text-[var(--button-primary)] transition-colors duration-200 font-medium"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        <span>Back to Projects</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={project.visible}
                                onChange={handleToggleVisibility}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                    </div>
                </div>

                <div className="rounded-2xl shadow-lg overflow-hidden bg-[var(--menu-bg)] border border-[var(--border-color)]">
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
                        <ProjectDetailsSection
                            project={project}
                            setProject={setProject}
                            isExpanded={isExpanded}
                            setIsExpanded={setIsExpanded}
                        />

                        <TagDisplaySection
                            project={project}
                            setProject={setProject}
                            newTag={newTag}
                            setNewTag={setNewTag}
                            isTagSubmitting={isTagSubmitting}
                            setIsTagSubmitting={setIsTagSubmitting}
                        />

                        <GallerySection
                            photos={project.photos}
                            id={project.id}
                            refreshProject={fetchProjectDetails}
                        />

                        <QuestionAnswerList
                            questions={questions}
                            refreshQuestions={fetchQuestions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProjectDetail;
