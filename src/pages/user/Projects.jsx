import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ✅ Sleek matching arrows
import { useProjectContext } from "../../context/ProjectContext";

const SkeletonCard = () => (
    <div className="space-y-4 animate-pulse min-w-[300px]">
        <div className="w-full h-52 bg-gray-300 rounded-xl"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
    </div>
);

const Projects = () => {
    const navigate = useNavigate();
    const { projects, loadingProjects } = useProjectContext();
    const scrollRef = useRef();

    const scroll = (direction) => {
        const container = scrollRef.current;
        const scrollAmount = 320;

        if (direction === "left") {
            container.scrollLeft -= scrollAmount;
        } else {
            container.scrollLeft += scrollAmount;
        }
    };

    const handleNavigate = () => {
        navigate("/seeallproject");
    };

    return (
        <section id="projects" className="py-16 px-4 sm:px-6 lg:px-12" style={{ backgroundColor: "var(--bg-color)" }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={{ color: "var(--text-color)" }}>
                Projects
                <div className="h-1 w-24 mx-auto mt-2 bg-[#5454D4] rounded-full"></div>
            </h2>

            <div className="relative max-w-7xl mx-auto">
                {/* Arrows like your screenshot */}
                {projects.length > 3 && (
                    <>
                        <button
                            onClick={() => scroll("left")}
                            className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:scale-110 transition"
                        >
                            <ChevronLeft size={28} className="text-gray-700" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:scale-110 transition"
                        >
                            <ChevronRight size={28} className="text-gray-700" />
                        </button>
                    </>
                )}

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide px-2"
                >
                    {(loadingProjects || projects.length === 0)
                        ? [...Array(3)].map((_, idx) => <SkeletonCard key={idx} />)
                        : projects.map((project) => (
                            <div
                                key={project.id}
                                className="space-y-4 min-w-[300px] cursor-pointer flex-shrink-0"
                                onClick={() => navigate(`/project/${project.id}`)}
                            >
                                <div className="w-full h-52 overflow-hidden rounded-xl shadow-md">
                                    <img
                                        src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold truncate" style={{ color: "var(--text-color)" }}>
                                        {project.title}
                                    </h3>
                                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                        Project Type - {project.categoryName || "N/A"}
                                    </p>
                                    <div className="flex items-center gap-1 text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                                        <Eye size={16} /> {project.views || 23}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="mt-12 flex justify-end">
                <button
                    onClick={handleNavigate}
                    className="px-6 py-3 font-semibold text-white transition"
                    style={{ backgroundColor: "var(--button-primary)" }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--button-primary-hover)")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--button-primary)")}
                >
                    See All Projects
                </button>
            </div>
        </section>
    );
};

export default Projects;
