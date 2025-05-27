"use client"

import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { useProjectContext } from "../../context/ProjectContext"

const SkeletonCard = () => (
    <div className="min-w-[300px] bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
        <div className="w-full h-56 bg-gray-200"></div>
        <div className="p-6 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
    </div>
)

const Projects = () => {
    const navigate = useNavigate()
    const { projects, loadingProjects } = useProjectContext()
    const scrollRef = useRef()

    const scroll = (direction) => {
        const container = scrollRef.current
        const scrollAmount = 320
        if (direction === "left") container.scrollLeft -= scrollAmount
        else container.scrollLeft += scrollAmount
    }

    const handleNavigate = () => {
        navigate("/seeallproject")
    }

    return (
        <section
            id="projects"
            className="scroll-mt-24 pt-24 sm:pt-28 px-4 sm:px-6 lg:px-12"
            style={{ backgroundColor: "var(--bg-color)" }}
        >
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-color)" }}>
                    Projects
                </h2>
                <div className="h-1 w-24 mx-auto bg-[#5454D4] rounded-full"></div>

                {/* 👇 Filter Bar Here */}
                <div className="mt-6 flex justify-center">
                    <div
                        className="flex flex-wrap justify-center px-1 py-1 gap-2 rounded-xl shadow-inner transition-all"
                        style={{
                            backgroundColor: "var(--hover-bg)",
                            border: "1px solid var(--border-color)",
                        }}
                    >
                        {["All", "Web", "ML", "Android"].map((item, index) => (
                            <button
                                key={index}
                                className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${index === 0
                                    ? "bg-blue-600 text-white"
                                    : "text-[var(--text-color)] hover:bg-[rgba(214,205,205,0.06)] dark:hover:bg-gray-400"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            {/* Projects Container */}
            <div className="relative max-w-7xl mx-auto">
                {/* Navigation Buttons */}
                {projects.length > 3 && (
                    <>
                        <button
                            onClick={() => scroll("left")}
                            className="hidden lg:flex absolute -left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-200 shadow-xl rounded-full p-3 hover:scale-110 hover:shadow-2xl transition-all duration-300"
                        >
                            <ChevronLeft size={24} className="text-gray-600" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="hidden lg:flex absolute -right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-200 shadow-xl rounded-full p-3 hover:scale-110 hover:shadow-2xl transition-all duration-300"
                        >
                            <ChevronRight size={24} className="text-gray-600" />
                        </button>
                    </>
                )}

                {/* Projects Grid */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {loadingProjects || projects.length === 0
                        ? [...Array(4)].map((_, idx) => <SkeletonCard key={idx} />)
                        : projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => navigate(`/project/${project.id}`)}
                                className="min-w-[300px] rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                                style={{
                                    backgroundColor: "var(--bg-color)",
                                    borderColor: "var(--border-color)",
                                }}
                            >
                                {/* Image Section */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                        alt={project.title}
                                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Price Tag */}
                                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
                                        NPR {project.price || "3000"}
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Info Section */}
                                <div className="p-6">
                                    <h3
                                        className="text-lg font-semibold mb-3 line-clamp-2 leading-tight"
                                        style={{ color: "var(--text-color)" }}
                                    >
                                        {project.title}
                                    </h3>

                                    <p className="text-sm mb-4 font-medium" style={{ color: "var(--text-secondary)" }}>
                                        Project Type - {project.categoryName || "N/A"}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                        <div className="flex items-center gap-1">
                                            <Eye size={16} />
                                            <span>{project.views || 23} Views</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                </div>
            </div>

            {/* See All Button */}
            <div className="mt-12 flex justify-center sm:justify-end">
                <button
                    onClick={handleNavigate}
                    className="px-6 py-3 font-semibold text-white transition"
                    style={{ backgroundColor: "var(--button-primary)" }}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--button-primary-hover)")
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--button-primary)")
                    }
                >
                    See All Projects
                </button>
            </div>
        </section>
    )
}

export default Projects
