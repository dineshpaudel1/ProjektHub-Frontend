import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { protectedApi } from "../../../services/axiosInstance";
import { useProjectContext } from "../../../context/ProjectContext";
import { notifySuccess, notifyError } from "../../../utils/toastNotify";

const AdminQuestion = ({ projectId }) => {
    const {
        questions,
        loadingQuestions,
        fetchQuestions,
    } = useProjectContext();

    const [questionText, setQuestionText] = useState("");
    const [visibleCount, setVisibleCount] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions(projectId);
    }, [projectId]);
    const handleLoadMore = () => setVisibleCount((prev) => prev + 5);
    const visibleQuestions = questions.slice(0, visibleCount);

    return (
        <div className="mt-10 space-y-8">
            {/* Questions and Answers */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Question and Answers</h2>

                {loadingQuestions ? (
                    <p className="text-sm text-gray-500">Loading questions...</p>
                ) : questions.length === 0 ? (
                    <p className="italic text-gray-500">No questions yet.</p>
                ) : (
                    <div className="space-y-6">
                        {visibleQuestions.map((q, idx) => (
                            <div key={idx} className="pb-4 border-b border-gray-200">
                                <p className="font-medium text-[var(--text-color)] mb-1">
                                    {q.questionText}
                                </p>
                                {q.answerText ? (
                                    <p className="text-sm text-gray-600">
                                        {q.answerText}
                                    </p>
                                ) : (
                                    <p className="italic text-sm text-yellow-500">
                                        Answer pending…
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {visibleCount < questions.length && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleLoadMore}
                            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminQuestion;
