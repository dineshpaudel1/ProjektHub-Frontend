import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { publicApi } from "../../services/axiosInstance";
import TotalProjectCard from "../../components/project/TotalProjectCard";
import OrderModal from "../../modals/OrderModal";
import noFoundPhoto from "../../assets/images/nofound.jpg";

const NoResultCard = ({ onGoBack }) => (
    <div className="flex flex-col items-center justify-center py-16">
        <img
            src={noFoundPhoto}
            alt="Result not found"
            className="w-40 h-40 mb-8 opacity-90"
        />
        <h3 className="text-xl font-semibold mb-2 text-[var(--text-color)]">
            Result Not Found
        </h3>
        <p className="text-[var(--text-secondary)] mb-6 text-center max-w-sm">
            Whoops … this information is not available at the moment.
        </p>
        <button
            onClick={onGoBack}
            className="px-6 py-2 rounded-md text-white transition-colors"
            style={{ backgroundColor: "var(--button-primary)" }}
            onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--button-primary-hover)")
            }
            onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--button-primary)")
            }
        >
            Go Back
        </button>
    </div>
);

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const keyword = new URLSearchParams(location.search).get("keyword")?.trim();

    useEffect(() => {
        if (!keyword) {
            setResults([]);
            return;
        }
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await publicApi.get(
                    `/public/projects/smart-search?keyword=${encodeURIComponent(keyword)}`
                );
                setResults(res.data?.data || []);
            } catch (err) {
                console.error("Smart-search error:", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [keyword]);

    const handleLiveView = (url) => {
        const fallback = "https://dineshpaudel1.com.np";
        window.open(url?.startsWith("http") ? url : fallback, "_blank");
    };

    const openModal = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    const handleGoBack = () => {
        if (window.history.length > 1) navigate(-1);
        else navigate("/");
    };

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)]">
            <div className="w-full max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
                    Search Results for:{" "}
                    <span className="text-blue-500">{keyword || "…"}</span>
                </h2>

                {loading && (
                    <p className="text-[var(--text-secondary)]">Loading…</p>
                )}

                {!loading && results.length === 0 && (
                    <NoResultCard onGoBack={handleGoBack} />
                )}

                {!loading && results.length > 0 && (
                    <div className="space-y-8">
                        {results.map((project) => {
                            const normalizedProject = {
                                ...project,
                                title: project.projectTitle,
                                seller: {
                                    name: project.sellerFullName || "Unknown Seller",
                                    photo: null,
                                    id: null,
                                },
                            };
                            return (
                                <TotalProjectCard
                                    key={project.id}
                                    project={normalizedProject}
                                    onLiveView={handleLiveView}
                                    onPurchase={() => openModal(normalizedProject)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            <OrderModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                selectedProject={selectedProject}
            />
        </div>
    );
};

export default Search;
