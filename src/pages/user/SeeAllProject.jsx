import React, { useState } from "react";
import { useProjectContext } from "../../context/ProjectContext";
import OrderModal from "../../modals/OrderModal";
import TotalProjectCard from "../../components/project/TotalProjectCard";

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

    const handleLiveView = (url) => {
        window.open(url || "https://dineshpaudel1.com.np", "_blank");
    };

    const openModal = (project) => {
        setSelectedProject(project);
        setShowModal(true);
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
                            <TotalProjectCard
                                key={project.id}
                                project={project}
                                onLiveView={handleLiveView}
                                onPurchase={openModal}
                            />
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
