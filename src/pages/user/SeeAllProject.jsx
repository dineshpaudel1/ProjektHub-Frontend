import React, { useState } from "react";
import { useProjectContext } from "../../context/ProjectContext";
import SocialModal from "../../modals/SocialModal";
import { useNavigate } from "react-router-dom";

const SkeletonCard = () => (
    <div className="bg-white border border-blue-200 rounded-lg p-6 flex flex-col md:flex-row items-start gap-6 shadow-sm animate-pulse">
        <div className="w-full md:w-[300px] md:h-[200px] bg-gray-300 rounded-md"></div>
        <div className="flex-1 space-y-4 mt-4 md:mt-0">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="flex gap-4 mt-4">
                <div className="h-10 w-24 bg-gray-300 rounded-md"></div>
                <div className="h-10 w-24 bg-gray-300 rounded-md"></div>
            </div>
        </div>
    </div>
);

const SeeAllProject = () => {
    const { projects, loadingProjects } = useProjectContext(); // ⬅️ Make sure this exists in your context
    const [showModal, setShowModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const navigate = useNavigate();

    const handleLiveView = () => {
        window.open("https://dineshpaudel1.com.np", "_blank");
    };

    const openModal = (id) => {
        setSelectedProjectId(id);
        setShowModal(true);
    };

    const goToProjectDetail = (id) => {
        navigate(`/project/${id}`);
    };

    return (
        <div className="bg-[#ffff] min-h-screen py-10 px-6 mt-10">
            <h2 className="text-3xl font-semibold font-playfair mb-10 text-blue-800">All Projects</h2>

            <div className="space-y-8">
                {(loadingProjects || projects.length === 0)
                    ? [...Array(4)].map((_, index) => (
                        <SkeletonCard key={index} />
                    ))
                    : projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white border border-blue-200 rounded-lg p-6 flex flex-col md:flex-row items-start gap-6 shadow-sm hover:shadow-md transition cursor-pointer"
                            onClick={() => goToProjectDetail(project.id)}
                        >
                            <img
                                src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                alt={project.title}
                                className="w-full md:w-[300px] md:h-[200px] object-cover rounded-md"
                            />
                            <div className="flex-1">
                                <h3 className="text-2xl font-semibold text-blue-600 mb-2 font-playfair">
                                    {project.title}
                                </h3>
                                <p className="text-gray-700 text-sm mb-4">
                                    {project.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, exercitationem..."}
                                </p>
                                <div className="flex gap-4 mt-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLiveView();
                                        }}
                                        className="bg-white border border-blue-300 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition"
                                    >
                                        Live View
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(project.id);
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                    >
                                        Buy Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            <SocialModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default SeeAllProject;
