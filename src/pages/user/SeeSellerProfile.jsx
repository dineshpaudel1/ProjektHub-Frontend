"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicApi } from "../../services/axiosInstance";
import { Loader, Calendar, Star, Award } from "lucide-react";

const SeeSellerProfile = () => {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    /* ───────────── Fetch Seller + Projects ───────────── */
    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const res = await publicApi.get(`/public/${id}/profile`);
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

    /* ───────────── Loading ───────────── */
    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
            >
                <div className="text-center">
                    <Loader className="animate-spin h-12 w-12 text-[var(--button-primary)] mx-auto mb-4" />
                    <p className="font-medium text-[var(--text-secondary)]">
                        Loading seller profile…
                    </p>
                </div>
            </div>
        );
    }

    /* ───────────── Not Found ───────────── */
    if (!seller) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
            >
                <p className="text-lg text-[var(--text-secondary)]">Seller not found</p>
            </div>
        );
    }

    /* ───────────── Main Content ───────────── */
    return (
        <div
            className="min-h-screen px-5 py-10 mt-10 transition-colors duration-300"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            {/* ── Hero Card ─────────────────────────────────── */}
            <div
                className="rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_40px_rgba(255,255,255,0.08)] transition duration-300"
                style={{
                    backgroundColor: "var(--navbar-bg)",
                    border: "1px solid var(--border-color)",
                }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                        {/* ── Profile Image ── */}
                        <div className="relative">
                            <img
                                src={`http://localhost:8080/api/media/photo?file=${seller.profilePicture}`}
                                alt={seller.sellerName}
                                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-xl"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                        </div>

                        {/* ── Profile Info ── */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                                {seller.sellerName}
                            </h1>

                            <p className="text-xl mb-4 font-medium text-[var(--text-secondary)]">
                                {seller.professionalTitle}
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-6 text-[var(--text-secondary)]">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">
                                        Joined {new Date(seller.joinedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    <span className="text-sm">{projects.length} Projects</span>
                                </div>
                            </div>

                            <p className="text-lg leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0 text-[var(--text-secondary)]">
                                {seller.bio}
                            </p>

                            {/* ── Skills ── */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                {seller.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                        style={{
                                            backgroundColor: "var(--hover-bg)",
                                            border: `1px solid var(--border-color)`,
                                            color: "var(--text-color)",
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Projects Section ──────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12 text-center lg:text-left">
                    <h2 className="text-3xl font-bold mb-4">Portfolio &amp; Projects</h2>
                    <div className="w-24 h-1 mx-auto lg:mx-0 bg-[var(--button-primary)] rounded-full" />
                    <p className="mt-4 text-lg text-[var(--text-secondary)]">
                        Explore the amazing work by {seller.sellerName}
                    </p>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-16">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ backgroundColor: "var(--hover-bg)" }}
                        >
                            <Award className="w-12 h-12 text-[var(--border-color)]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            No Projects Yet
                        </h3>
                        <p className="text-[var(--text-secondary)]">
                            This seller hasn’t uploaded any projects yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => navigate(`/project/${project.id}`)}
                                className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300"
                                style={{
                                    backgroundColor: "var(--bg-color)",
                                    border: `1px solid var(--border-color)`,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                }}
                            >
                                {/* ─ Project Image ─ */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                        alt={project.title}
                                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>

                                {/* ─ Project Info ─ */}
                                <div className="p-6">
                                    <div className="mb-3">
                                        <span
                                            className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                                            style={{
                                                backgroundColor: "var(--hover-bg)",
                                                color: "var(--text-color)",
                                            }}
                                        >
                                            {project.categoryName}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-[var(--button-primary)] transition-colors">
                                        {project.title}
                                    </h3>

                                    <div className="flex items-center justify-between mt-4">
                                        {/* Stars */}
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4].map((n) => (
                                                <Star
                                                    key={n}
                                                    className="w-4 h-4 text-yellow-400 fill-current"
                                                />
                                            ))}
                                            <Star className="w-4 h-4 text-gray-300" />
                                            <span className="text-sm text-[var(--text-secondary)] ml-1">
                                                (4.0)
                                            </span>
                                        </div>
                                        {/* Price */}
                                        <p className="text-2xl font-bold text-green-600">
                                            NPR {project.price.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeeSellerProfile;
