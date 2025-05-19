import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    const [projectDetail, setProjectDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    // Fetch all public projects
    const fetchProjects = async () => {
        try {
            setLoadingProjects(true);
            const res = await axios.get("http://localhost:8080/api/public/projects");
            if (res.data.status === "success") {
                setProjects(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
        } finally {
            setLoadingProjects(false);
        }
    };

    // Fetch single project detail by ID
    const fetchProjectDetail = async (id) => {
        try {
            setLoadingDetail(true);
            const res = await axios.get(`http://localhost:8080/api/public/project/${id}`);
            if (res.data.status === "success") {
                setProjectDetail(res.data.data);
            }
        } catch (err) {
            console.error(`Error fetching project detail for ID ${id}:`, err);
        } finally {
            setLoadingDetail(false);
        }
    };

    // Fetch questions for a specific project
    const fetchQuestions = async (id) => {
        try {
            setLoadingQuestions(true);
            const res = await axios.get(`http://localhost:8080/api/public/project/${id}/interactions`);
            setQuestions(res.data.data || []);
        } catch (err) {
            console.error("Error fetching questions:", err);
        } finally {
            setLoadingQuestions(false);
        }
    };

    // Load projects on first mount
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
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

// Custom hook for easy access
export const useProjectContext = () => useContext(ProjectContext);
