import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { publicApi } from "../utils/axiosInstance";  // ✅ Updated import

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const hasFetchedProjects = useRef(false);

    const [projectDetail, setProjectDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const fetchProjects = async () => {
        if (hasFetchedProjects.current) return;

        try {
            setLoadingProjects(true);
            const res = await publicApi.get("public/projects");
            if (res.data.status === "success") {
                setProjects(res.data.data);
                hasFetchedProjects.current = true;
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
        } finally {
            setLoadingProjects(false);
        }
    };

    const fetchProjectDetail = async (id) => {
        try {
            setLoadingDetail(true);
            const res = await publicApi.get(`public/project/${id}`);
            if (res.data.status === "success") {
                setProjectDetail(res.data.data);
            }
        } catch (err) {
            console.error(`Error fetching project detail for ID ${id}:`, err);
        } finally {
            setLoadingDetail(false);
        }
    };

    const fetchQuestions = async (id) => {
        try {
            setLoadingQuestions(true);
            const res = await publicApi.get(`public/project/${id}/interactions`);
            setQuestions(res.data.data || []);
        } catch (err) {
            console.error("Error fetching questions:", err);
        } finally {
            setLoadingQuestions(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <ProjectContext.Provider
            value={{
                projects,
                loadingProjects,
                projectDetail,
                loadingDetail,
                fetchProjects,
                fetchProjectDetail,
                questions,
                loadingQuestions,
                fetchQuestions,
                selectedProject,
                setSelectedProject,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjectContext = () => useContext(ProjectContext);
