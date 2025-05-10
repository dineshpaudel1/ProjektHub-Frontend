"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../../utils/axiosInstance"
import { Loader, ArrowLeft, Star, ShoppingBag, Tag, ImageIcon, MessageCircle } from "lucide-react"
import SocialModal from "../../modals/SocialModal"
import NotificationToast from "../../porjectdetailhelper/NotificationToast"

const getEmbedUrl = (url) => {
    try {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/)
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`
        }
        return null
    } catch {
        return null
    }
}

const UserProjectDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [questionText, setQuestionText] = useState("")
    const [questions, setQuestions] = useState([])
    const [isExpanded, setIsExpanded] = useState(false)
    const [notification, setNotification] = useState(null);


    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`/public/project/${id}/interactions`)
            setQuestions(res.data.data || [])
        } catch (err) {
            console.error("Error fetching questions:", err)
        }
    }

    const handleAskQuestion = async (e) => {
        e.preventDefault()
        if (!questionText.trim()) return

        const token = localStorage.getItem("accessToken")

        if (!token) {
            setNotification({ type: "error", message: "Please login to ask a question." });
            localStorage.setItem("redirectAfterLogin", `/project/${id}`);

            // Delay the navigation slightly to let the toast show
            setTimeout(() => {
                navigate("/login");
            }, 1500);

            return;
        }


        try {
            await axios.post(
                `/user/interactions/question`,
                { projectId: id, questionText },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            setQuestionText("")
            fetchQuestions()
        } catch (err) {
            console.error("Error submitting question:", err)
        }
    }

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`/public/project/${id}`)
                setProject(response.data.data)
            } catch (err) {
                console.error("❌ Error fetching project details:", err)
                setError("Failed to load project details.")
            } finally {
                setLoading(false)
            }
        }

        fetchProjectDetails()
        fetchQuestions()
    }, [id])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin h-12 w-12 text-[var(--button-primary)]" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="p-6 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg max-w-md text-center shadow-lg">
                    {error}
                </div>
            </div>
        )
    }

    if (!project) return null

    const embedUrl = getEmbedUrl(project.previewVideoUrl)

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
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
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
                                                    ? "AI/ML Project web based Project with comprehensive features and functionality. This project demonstrates advanced techniques in artificial intelligence and machine learning, implemented in a user-friendly web interface."
                                                    : "AI/ML Project web based Project..."}
                                            </p>
                                            <button
                                                className="text-[var(--button-primary)] font-medium hover:underline focus:outline-none transition-colors"
                                                onClick={() => setIsExpanded(!isExpanded)}
                                            >
                                                {isExpanded ? "Show less" : "Read more"}
                                            </button>
                                        </div>
                                    </div>

                                    {project.tags?.length > 0 && (
                                        <div className="pt-4">
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

                                <div className="rounded-xl shadow-lg p-6 w-full lg:w-80 bg-[var(--hover-bg)] border border-[var(--border-color)]">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-baseline justify-between">
                                                <p className="text-3xl font-bold text-[var(--button-primary)]">NPR {project.price}.99</p>
                                                <p className="text-sm line-through text-gray-500">NPR 2999.99</p>
                                            </div>
                                            <p className="text-green-600 text-sm font-bold">33% OFF</p>
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                className="w-full bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
                                                onClick={() => setIsModalOpen(true)}
                                            >
                                                Request to Buy
                                            </button>
                                            <p className="text-xs text-center mt-3 text-[var(--text-secondary)]">24/7 support available</p>
                                        </div>

                                        <div className="pt-4 border-t border-[var(--border-color)]">
                                            <div className="flex justify-between text-sm py-2">
                                                <span className="text-[var(--text-secondary)]">License:</span>
                                                <span className="font-medium">Standard</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-2">
                                                <span className="text-[var(--text-secondary)]">Updates:</span>
                                                <span className="font-medium">6 months</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                                        className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity duration-200"
                                                    />
                                                </div>
                                                {photo.caption && <p className="text-sm mt-2 px-1 font-medium">{photo.caption}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-12">
                                <h2 className="flex items-center text-xl font-semibold mb-4">
                                    <MessageCircle className="h-5 w-5 mr-2" />
                                    Ask a Question
                                </h2>
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
                                {questions.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-4">Previous Questions</h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {questions.map((q, idx) => (
                                                <li
                                                    key={idx}
                                                    className="bg-[var(--hover-bg)] border border-[var(--border-color)] p-4 rounded-lg text-sm shadow-md"
                                                >
                                                    <p className="text-[var(--text-color)]">{q.questionText}</p>
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
    )
}

export default UserProjectDetail
