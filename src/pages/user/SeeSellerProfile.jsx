import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { Loader } from "lucide-react";

const SeeSellerProfile = () => {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/public/${id}/profile`);
                setSeller(res.data.data.seller);
                setProjects(res.data.data.projects);
            } catch (error) {
                console.error("Error fetching seller profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader className="animate-spin h-10 w-10 text-[var(--button-primary)]" />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "var(--bg-color)", minHeight: "100vh" }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 mt-10">
                {/* Seller Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
                    <img
                        src={`http://localhost:8080/api/media/photo?file=${seller.profilePicture}`}
                        alt={seller.sellerName}
                        className="w-28 h-28 rounded-full object-cover border-2 border-[var(--button-primary)] shadow-md"
                    />
                    <div className="text-center md:text-left">
                        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-color)]">{seller.sellerName}</h1>
                        <p className="text-sm text-[var(--text-secondary)] italic">{seller.professionalTitle}</p>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">{seller.bio}</p>
                        <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
                            Joined on {new Date(seller.joinedAt).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                            {seller.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full text-xs font-medium"
                                    style={{
                                        backgroundColor: "var(--hover-bg)",
                                        color: "var(--text-color)",
                                        border: "1px solid var(--border-color)"
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Seller's Projects */}
                <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-color)] mb-4">
                    Projects by {seller.sellerName}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/project/${project.id}`)}
                            className="rounded-lg border shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
                            style={{
                                backgroundColor: "var(--hover-bg)",
                                borderColor: "var(--border-color)"
                            }}
                        >
                            <img
                                src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                alt={project.title}
                                className="h-40 w-full object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[var(--text-color)] truncate">{project.title}</h3>
                                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                                    Category: {project.categoryName}
                                </p>
                                <p className="text-sm sm:text-md font-bold text-[var(--button-primary)] mt-2">
                                    NPR {project.price}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeeSellerProfile;
