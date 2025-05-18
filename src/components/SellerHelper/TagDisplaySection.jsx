import React, { useState, useRef, useEffect } from "react";
import { Tag, X, Info, Plus, Save } from "lucide-react";
import axios from "../../utils/axiosInstance";

const TagDisplaySection = ({
    project,
    setProject,
    isTagSubmitting,
    setIsTagSubmitting,
    setNotification,
}) => {
    const token = localStorage.getItem("token");
    const [inputVisible, setInputVisible] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [pendingTags, setPendingTags] = useState([]);
    const wrapperRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setInputVisible(false);
                setNewTag("");
                setPendingTags([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDeleteTag = async (tagId) => {
        try {
            await axios.delete(`http://localhost:8080/api/seller/project/${project.id}/tag`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                data: { tagId },
            });

            const updatedTags = project.tags.filter((tag) => tag.id !== tagId);
            setProject((prev) => ({ ...prev, tags: updatedTags }));
            setNotification({ type: "success", message: "Tag deleted successfully!" });
        } catch (error) {
            console.error("Failed to delete tag:", error);
            setNotification({ type: "error", message: "Failed to delete tag." });
        } finally {
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleRemovePendingTag = (index) => {
        setPendingTags((prev) => prev.filter((_, i) => i !== index));
    };

    const handleLocalTagAdd = (e) => {
        if (e.key === " " || e.key === ",") {
            e.preventDefault();
            const tag = newTag.trim();
            const exists =
                project.tags.some((t) => t.tag.toLowerCase() === tag.toLowerCase()) ||
                pendingTags.includes(tag.toLowerCase());

            if (tag && !exists) {
                setPendingTags([...pendingTags, tag]);
            }
            setNewTag("");
        }
    };

    const handleSaveTags = async () => {
        if (pendingTags.length === 0) return;

        try {
            setIsTagSubmitting(true);
            await axios.post(
                `/seller/project/addTags/${project.id}`,
                { tag: pendingTags },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const newTagObjects = pendingTags.map((tag) => ({
                id: Date.now() + Math.random(),
                tag,
            }));

            setProject((prev) => ({
                ...prev,
                tags: [...prev.tags, ...newTagObjects],
            }));

            setNotification({ type: "success", message: "Tags added successfully!" });
            setPendingTags([]);
            setNewTag("");
            setInputVisible(false);
        } catch (err) {
            console.error("Failed to add tags:", err);
            setNotification({ type: "error", message: "Failed to add tags." });
        } finally {
            setIsTagSubmitting(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-1">
                <h2 className="flex items-center text-xl font-bold text-black">
                    Tags
                </h2>
            </div>

            <div
                ref={wrapperRef}
                className="flex flex-wrap items-center gap-2  px-3 py-2 rounded-md bg-white dark:bg-[var(--menu-bg)] w-full max-w-xl"
            >
                {/* Existing tags */}
                {project.tags?.map((tag) => (
                    <span
                        key={tag.id}
                        className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-800"
                    >
                        {tag.tag}
                        <X
                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                            onClick={() => handleDeleteTag(tag.id)}
                        />
                    </span>
                ))}

                {/* Inline input with pending tags */}
                {inputVisible && (
                    <div className="flex items-center flex-wrap gap-2 relative max-w-full border border-gray-300 rounded-2xl p-2">
                        {pendingTags.map((tag, i) => (
                            <span
                                key={i}
                                className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-800"
                            >
                                {tag}
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                    onClick={() => handleRemovePendingTag(i)}
                                />
                            </span>
                        ))}
                        <div className="relative">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleLocalTagAdd}
                                placeholder="Type and hit space/comma..."
                                className="px-2 py-1 pr-8 text-sm focus:outline-none bg-transparent text-gray-800"
                            />
                            <button
                                onClick={handleSaveTags}
                                disabled={isTagSubmitting}
                                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                            >
                                <Save size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Add tag button — always visible at end */}
                {!inputVisible && (
                    <button
                        onClick={() => setInputVisible(true)}
                        className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
                    >
                        <Plus className="w-4 h-4" />
                        Add tag
                    </button>
                )}
            </div>
        </div>
    );
};

export default TagDisplaySection;
