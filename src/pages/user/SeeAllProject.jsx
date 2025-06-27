import React, { useState } from "react";
import { useProjectContext } from "../../context/ProjectContext";
import OrderModal from "../../modals/OrderModal";
import { useNavigate } from "react-router-dom";

const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        <div className="p-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 h-48 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-4 pt-4">
                    <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
                    <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
                </div>
            </div>
        </div>
    </div>
);

const SeeAllProject = () => {
    const { projects, loadingProjects } = useProjectContext();
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const navigate = useNavigate();

    const handleLiveView = (url) => {
        window.open(url || "https://dineshpaudel1.com.np", "_blank");
    };

    const openModal = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    const goToProjectDetail = (id) => {
        navigate(`/project/${id}`);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-color)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header
                    className="border-b"
                    style={{
                        backgroundColor: "var(--navbar-bg)",
                        borderColor: "var(--border-color)",
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10">
                        <h1 className="text-3xl font-bold text-[var(--text-color)]">
                            Total Projects
                        </h1>
                    </div>
                </header>

                <div className="space-y-6">
                    {loadingProjects || projects.length === 0 ? (
                        [...Array(4)].map((_, index) => <SkeletonCard key={index} />)
                    ) : (
                        projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-[var(--menu-bg)] text-[var(--text-color)] rounded-lg shadow-sm border border-[var(--border-color)] overflow-hidden transition-all hover:shadow-md"
                            >
                                <div
                                    className="p-6 flex flex-col md:flex-row gap-6 cursor-pointer"
                                    onClick={() => goToProjectDetail(project.id)}
                                >
                                    <div className="w-full md:w-64 h-48 flex-shrink-0">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/media/photo?file=${project.thumbnail}`}
                                            alt={project.title}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold font-serif">
                                                {project.title}
                                            </h3>
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-800 dark:text-white">
                                                {project.categoryName}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2 overflow-hidden">
                                                {project.seller.photo ? (
                                                    <img
                                                        src={project.seller.photo}
                                                        alt={project.seller.name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-600">
                                                        {project.seller.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                {project.seller.name}
                                            </p>
                                        </div>

                                        <p className="mt-3 text-[var(--text-secondary)]">
                                            {project.description ||
                                                "Professional project with high-quality implementation."}
                                        </p>

                                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLiveView(project.demoUrl);
                                                }}
                                                className="px-4 py-2 border border-[var(--border-color)] rounded-md hover:bg-[var(--hover-bg)] transition-colors"
                                            >
                                                Live Preview
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openModal(project);
                                                }}
                                                className="px-4 py-2 bg-[var(--button-primary)] text-white rounded-md hover:bg-[var(--button-primary-hover)] transition-colors"
                                            >
                                                Purchase (Rs. {project.price})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <OrderModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                selectedProject={selectedProject}
            />
        </div>
    );
};

export default SeeAllProject;
