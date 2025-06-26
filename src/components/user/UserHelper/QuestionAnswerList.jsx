import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { protectedApi } from "../../../services/axiosInstance";
import { useProjectContext } from "../../../context/ProjectContext";
import { notifySuccess, notifyError } from "../../../utils/toastNotify";

const UserQuestionAnswerList = ({ projectId }) => {
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

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!questionText.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            notifyError("Please login to ask a question.");
            localStorage.setItem("redirectAfterLogin", `/project/${projectId}`);
            navigate("/login");
            return;
        }

        try {
            await protectedApi.post("/user/interactions/question", {
                projectId,
                questionText,
            });
            setQuestionText("");
            fetchQuestions(projectId);
            notifySuccess("Question submitted successfully!");
        } catch (err) {
            console.error("Error submitting question:", err);
            notifyError("Failed to submit question");
        }
    };

    const handleLoadMore = () => setVisibleCount((prev) => prev + 5);
    const visibleQuestions = questions.slice(0, visibleCount);

    return (
        <div className="mt-10 space-y-8">
            {/* Ask a Question */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Ask a Question</h2>
                <form onSubmit={handleAskQuestion}>
                    <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Type your question..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                    <button
                        type="submit"
                        className="mt-4 px-6 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
                    >
                        Submit
                    </button>
                </form>
            </div>

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

export default UserQuestionAnswerList;
