import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { Loader, ArrowLeft } from 'lucide-react';
import SocialModal from '../../modals/SocialModal';

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

    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState([]);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`/public/project/${id}/interactions`);
            setQuestions(res.data.data || []);
        } catch (err) {
            console.error('Error fetching questions:', err);
        }
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `/user/interactions/question`,
                { projectId: id, question },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuestion('');
            fetchQuestions(); // refresh the questions
        } catch (err) {
            console.error('Error submitting question:', err);
        }
    };

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/public/project/${id}`);
                setProject(response.data.data);
            } catch (err) {
                console.error('❌ Error fetching project details:', err);
                setError('Failed to load project details.');
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
                <div className="p-6 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg max-w-md text-center">
                    {error}
                </div>
            </div>
        );
    }

    if (!project) return null;

    const embedUrl = getEmbedUrl(project.previewVideoUrl);

    return (
        <>
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-all duration-300">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-[var(--text-secondary)] hover:text-[var(--button-primary)] transition"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            <span className="text-sm font-medium">Back to Projects</span>
                        </button>
                    </div>

                    <div className="rounded-xl shadow-sm overflow-hidden bg-[var(--menu-bg)] border border-[var(--border-color)]">
                        <div className="relative h-80 w-full">
                            <iframe
                                src={embedUrl}
                                className="absolute top-0 left-0 w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Project preview"
                            ></iframe>
                            <span className="absolute top-4 left-4 bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                Featured
                            </span>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                                    <div className="flex items-center space-x-2 text-sm text-yellow-500 mb-2">
                                        <span>★★★★★</span>
                                        <span className="text-[var(--text-secondary)] font-medium">(128 reviews)</span>
                                        <span className="text-green-600 font-medium ml-4">1,234 purchases</span>
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-sm mb-2">AI/ML Project web based Project...</p>
                                    <a className="text-[var(--button-primary)] text-sm underline cursor-pointer">Read more</a>
                                </div>

                                <div className="rounded-xl shadow-md p-5 mt-6 lg:mt-0 lg:ml-6 w-full max-w-sm bg-[var(--hover-bg)] border border-[var(--border-color)]">
                                    <p className="text-xl font-semibold mb-1">
                                        <span className="text-2xl font-bold text-[var(--button-primary)]">NPR {project.price}.99</span>
                                    </p>
                                    <p className="text-sm line-through text-gray-500 mb-1">NPR 2999.99</p>
                                    <p className="text-green-600 text-sm font-semibold mb-4">33% OFF</p>
                                    <button
                                        className="w-full bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-semibold py-2 rounded-lg transition"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Request to Buy
                                    </button>
                                    <p className="text-xs text-[var(--text-secondary)] text-center mt-2">12/24 hour support available</p>
                                </div>
                            </div>

                            {project.tags?.length > 0 && (
                                <div className="mt-10">
                                    <h2 className="text-lg font-semibold mb-3">Tags</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                #{tag.tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.photos?.length > 0 && (
                                <div className="mt-10">
                                    <h2 className="text-lg font-semibold mb-3">Gallery</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {project.photos.map((photo) => (
                                            <div key={photo.id} className="group relative">
                                                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                                                    <img
                                                        src={`http://localhost:8080/api/media/photo?file=${photo.path}`}
                                                        alt={photo.caption || 'Project Photo'}
                                                        className="w-full h-48 sm:h-56 object-cover group-hover:opacity-90 transition-opacity duration-200"
                                                    />
                                                </div>
                                                {photo.caption && (
                                                    <p className="text-sm mt-2 px-1 font-semibold">{photo.caption}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ask a Question Section */}
                            <div className="mt-10">
                                <h2 className="text-lg font-semibold mb-3">Ask a Question</h2>
                                <form onSubmit={handleAskQuestion} className="mb-6">
                                    <textarea
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="Type your question..."
                                        className="w-full px-3 py-2 border border-[var(--border-color)] rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] bg-transparent"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white px-4 py-2 rounded"
                                    >
                                        Submit Question
                                    </button>
                                </form>
                                {questions.length > 0 && (
                                    <div>
                                        <h3 className="text-md font-semibold mb-2">Previous Questions</h3>
                                        <ul className="space-y-2">
                                            {questions.map((q, idx) => (
                                                <li key={idx} className="border p-3 rounded bg-[var(--hover-bg)] text-sm">
                                                    {q.question}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
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
