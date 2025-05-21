import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { useProjectContext } from "../../context/ProjectContext";





const SkeletonCard = () => (
    <div className="space-y-4 animate-pulse">
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


    const handleNavigate = () => {
        navigate("/seeallproject");
    };

    return (
        <section id="projects" className="py-16 px-4 sm:px-6 lg:px-12" style={{ backgroundColor: "var(--bg-color)" }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={{ color: "var(--text-color)" }}>
                Projects
                <div className="h-1 w-24 mx-auto mt-2 bg-[#5454D4] rounded-full"></div>
            </h2>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {loadingProjects || projects.length === 0
                    ? [...Array(3)].map((_, idx) => <SkeletonCard key={idx} />)
                    : projects.map((project) => (
                        <div
                            key={project.id}
                            className="space-y-4 cursor-pointer"
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
