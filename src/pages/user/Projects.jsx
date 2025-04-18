import React from "react";
import { Eye } from "lucide-react";
import thumbnail from "../../assets/images/thumbnailone.png";

const projects = [
    {
        id: 1,
        title: "Music Recommendor System with all implementation details...",
        type: "Website hello its me",
        views: "1.2k",
        image: thumbnail,
    },
    {
        id: 2,
        title: "Music Recommendor System with all implementation details...",
        type: "Website hello its me",
        views: "1.2k",
        image: thumbnail,
    },
    {
        id: 3,
        title: "Music Recommendor System with all implementation details...",
        type: "Website hello its me",
        views: "1.2k",
        image: thumbnail,
    },
];

const Projects = () => {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-12" style={{ backgroundColor: "var(--bg-color)" }}>
            <h2
                className="text-3xl sm:text-4xl font-bold text-center mb-12"
                style={{ color: "var(--text-color)" }}
            >
                Projects
                <div className="h-1 w-24 mx-auto mt-2 bg-[#5454D4] rounded-full"></div>
            </h2>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {projects.map((project) => (
                    <div key={project.id} className="space-y-4">
                        {/* Thumbnail with fixed height */}
                        <div className="w-full h-52 overflow-hidden rounded-xl shadow-md">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Project Text */}
                        <div>
                            <h3
                                className="text-lg font-semibold truncate"
                                style={{ color: "var(--text-color)" }}
                            >
                                {project.title}
                            </h3>
                            <p
                                className="text-sm"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                Project Type - {project.type}
                            </p>
                            <div className="flex items-center gap-1 text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                                <Eye size={16} /> {project.views}
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            <div className="mt-12 flex justify-end">
                <button
                    className="px-6 py-3 font-semibold text-white  transition"
                    style={{
                        backgroundColor: "var(--button-primary)",
                        transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--button-primary-hover)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--button-primary)";
                    }}
                >
                    See All Projects
                </button>
            </div>
        </section>
    );
};

export default Projects;
