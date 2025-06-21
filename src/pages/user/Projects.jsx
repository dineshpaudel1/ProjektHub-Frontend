import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useProjectContext } from "../../context/ProjectContext";

const SkeletonCard = () => (
    <div className="min-w-[300px] bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
        <div className="w-full h-56 bg-gray-200"></div>
        <div className="p-6 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
    </div>
);

const Projects = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { projects, loadingProjects, categories } = useProjectContext();
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const scrollRef = useRef();

    const filteredProjects =
        selectedCategory === "ALL"
            ? projects
            : projects.filter((p) => p.categoryName?.toUpperCase() === selectedCategory);

    const scroll = (direction) => {
        const container = scrollRef.current;
        const scrollAmount = 320;
        if (direction === "left") container.scrollLeft -= scrollAmount;
        else container.scrollLeft += scrollAmount;
    };

    const handleNavigate = () => {
        navigate("/seeallproject");
    };

    useEffect(() => {
        if (location.state?.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]);

    return (
        <section
            id="projects"
            className="scroll-mt-24 pt-24 sm:pt-28 px-4 sm:px-6 lg:px-12"
            style={{ backgroundColor: "var(--bg-color)" }}
        >
            <div className="text-center mb-12">
                <h2
                    className="text-3xl sm:text-4xl font-bold mb-4"
                    style={{ color: "var(--text-color)" }}
                >
                    Projects
                </h2>
                <div className="h-1 w-24 mx-auto bg-[#5454D4] rounded-full"></div>

                {/* Category Filter */}
                <div className="mt-6 overflow-x-auto scrollbar-hide">
                    <div className="flex justify-start sm:justify-center items-center gap-6 min-w-max px-2 sm:px-0">
                        {["ALL", ...categories.map((cat) => cat.name.toUpperCase())].map((name) => (
                            <button
                                key={name}
                                onClick={() => setSelectedCategory(name)}
                                className={`text-sm font-bold whitespace-nowrap transition-all pb-1 border-b-2 ${selectedCategory === name
                                    ? "font-bold border-blue-600"
                                    : "border-transparent hover:border-blue-600"
                                    }`}
                                style={{
                                    color:
                                        selectedCategory === name
                                            ? "var(--text-color)"
                                            : "var(--text-secondary)",
                                }}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects Section */}
            <div className="relative max-w-7xl mx-auto">
                {/* Scroll Buttons */}
                {projects.length > 3 && (
                    <>
                        <button
                            onClick={() => scroll("left")}
                            className="hidden lg:flex absolute -left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-[var(--bg-color)] border border-gray-200 dark:border-[var(--border-color)] shadow-xl rounded-full p-3 hover:scale-110 hover:shadow-2xl transition-all duration-300"
                        >
                            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="hidden lg:flex absolute -right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-[var(--bg-color)] border border-gray-200 dark:border-[var(--border-color)] shadow-xl rounded-full p-3 hover:scale-110 hover:shadow-2xl transition-all duration-300"
                        >
                            <ChevronRight size={24} className="text-gray-600 dark:text-gray-300" />
                        </button>
                    </>
                )}

                {/* Projects List */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {(loadingProjects || (!projects.length && !filteredProjects.length)) ? (
                        [...Array(4)].map((_, idx) => <SkeletonCard key={idx} />)
                    ) : filteredProjects.length === 0 ? (
                        <div className="w-full flex justify-center items-center py-12">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-color)" }}>
                                    No Projects Found
                                </h3>
                                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                    Try selecting a different category.
                                </p>
                            </div>
                        </div>
                    ) : (
                        filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => navigate(`/project/${project.id}`)}
                                className="flex-shrink-0 w-80 bg-white dark:bg-[var(--bg-color)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
                                        alt={project.title}
                                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded-full">
                                        NPR {project.price?.toLocaleString() || "3000"}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Info */}
                                <div className="p-6">
                                    <div className="mb-3">
                                        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                                            {project.categoryName || "Uncategorized"}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors truncate line-clamp-1" style={{ color: "var(--text-color)" }}>
                                        {project.title}
                                    </h3>

                                    <p className="text-sm mb-4 line-clamp-1" style={{ color: "var(--text-secondary)" }}>
                                        {project.description || "No description available"}
                                    </p>

                                    <div className="flex items-center justify-between text-sm" style={{ color: "var(--text-secondary)" }}>
                                        <p className="text-sm  line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                                            By: {project.seller.name || "No description available"}
                                        </p>
                                        <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700">
                                            <span className="font-medium">View</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* See All Projects */}
            <div className="mt-12 flex justify-center sm:justify-end">
                <button
                    onClick={handleNavigate}
                    className="px-8 py-3 font-semibold rounded-xl text-white transition"
                    style={{ backgroundColor: "var(--button-primary)" }}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--button-primary-hover)")
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--button-primary)")
                    }
                >
                    See All Projects
                </button>
            </div>
        </section>
    );
};

export default Projects;
