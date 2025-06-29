import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { protectedApi } from "../../../services/axiosInstance";
import { useProjectContext } from "../../../context/ProjectContext";
import { notifySuccess, notifyError } from "../../../utils/toastNotify";
import { MdQuestionAnswer, MdChatBubble } from "react-icons/md";

/* 🔸 tiny helper for “26 June 2025” style dates */
const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

const QAIcon = ({ label }) => (
    <span className="w-7 h-7 shrink-0 rounded bg-blue-600 text-white font-bold grid place-items-center text-xs">
        {label}
    </span>
);

const UserQuestionAnswerList = ({ projectId }) => {
    const { questions, loadingQuestions, fetchQuestions } = useProjectContext();

    const [questionText, setQuestionText] = useState("");
    const [visibleCount, setVisibleCount] = useState(5);
    const navigate = useNavigate();

    /* 🔄 load questions on mount / project change */
    useEffect(() => {
        fetchQuestions(projectId);
    }, [projectId]);

    /* 📝 submit handler */
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
            fetchQuestions(projectId); // refresh
            notifySuccess("Question submitted successfully!");
        } catch (err) {
            console.error("Error submitting question:", err);
            notifyError("Failed to submit question");
        }
    };

    /* ⬇️ show more */
    const handleLoadMore = () => setVisibleCount((prev) => prev + 3);
    const visibleQuestions = questions.slice(0, visibleCount);

    return (
        <div className="mt-10 space-y-12">
            {/* 🔹 Ask a Question */}
            <section>
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
            </section>

            {/* 🔹 Questions & Answers */}
            <section>
                <h2 className="text-xl font-semibold mb-6">Question and Answers</h2>

                {loadingQuestions ? (
                    <p className="text-sm text-gray-500">Loading questions...</p>
                ) : questions.length === 0 ? (
                    <p className="italic text-gray-500">No questions yet.</p>
                ) : (
                    <ul className="space-y-10">
                        {visibleQuestions.map((q) => (
                            <li key={q.questionId} className="space-y-6">
                                {/* 🔻 Question */}
                                <div className="flex items-start gap-3">
                                    <QAIcon label="Q" />
                                    <div className="flex-1">
                                        <p className="font-medium text-[var(--text-color)]">
                                            {q.questionText}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {q.askedBy} &nbsp;•&nbsp; {formatDate(q.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* 🔻 Answer */}
                                {q.answerText ? (
                                    <div className="flex items-start gap-3">
                                        <QAIcon label="A" />
                                        <div className="flex-1">
                                            <p className="text-[var(--text-secondary)]">
                                                {q.answerText}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {q.answeredBy || "Seller"} &nbsp;•&nbsp;{" "}
                                                {q.answeredAt ? formatDate(q.answeredAt) : "•"}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="italic text-sm text-yellow-500 pl-10">
                                        Answer pending…
                                    </p>
                                )}
                                {/* thin divider */}
                                <hr className="border-t border-gray-200" />
                            </li>
                        ))}
                    </ul>
                )}

                {visibleCount < questions.length && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleLoadMore}
                            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default UserQuestionAnswerList;
