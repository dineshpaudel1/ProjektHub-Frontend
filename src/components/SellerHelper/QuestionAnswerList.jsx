import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const QuestionAnswerList = ({ questions, refreshQuestions }) => {
    const [answerMap, setAnswerMap] = useState({});
    const [submitting, setSubmitting] = useState({});

    const handleAnswerChange = (questionId, value) => {
        setAnswerMap((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (questionId) => {
        const token = localStorage.getItem("token");
        if (!token || !answerMap[questionId]?.trim()) return;

        setSubmitting((prev) => ({ ...prev, [questionId]: true }));

        try {
            await axios.post(
                "/seller/interactions/answer-question",
                {
                    questionId,
                    answerText: answerMap[questionId].trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAnswerMap((prev) => ({ ...prev, [questionId]: "" }));
            refreshQuestions();
            toast.success("Answer submitted successfully.");
        } catch (err) {
            console.error("❌ Error submitting answer:", err);
            toast.error("Failed to submit answer. Please try again.");
        } finally {
            setSubmitting((prev) => ({ ...prev, [questionId]: false }));
        }
    };

    if (!questions || questions.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="flex items-center text-xl font-semibold mb-4">
                <MessageCircle className="h-5 w-5 mr-2" />
                Questions & Answers
            </h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {questions.map((q) => {
                    const questionId = q.questionId;
                    const askedDate = new Date(q.createdAt).toLocaleString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    return (
                        <li
                            key={questionId}
                            className="bg-[var(--hover-bg)] border border-[var(--border-color)] p-4 rounded-lg text-sm shadow-md space-y-2"
                        >
                            <div>
                                <p className="font-medium text-[var(--text-color)]">Q: {q.questionText}</p>
                                <p className="text-xs text-gray-500">Asked by: {q.askedBy} on {askedDate}</p>
                            </div>

                            {q.answerText ? (
                                <div className="mt-2 border-t pt-2 border-gray-300 dark:border-gray-600">
                                    <p className="font-medium text-[var(--button-primary-hover)]">A: {q.answerText}</p>
                                    <p className="text-xs text-gray-500">Answered by: {q.answeredBy}</p>
                                </div>
                            ) : (
                                <>
                                    <p className="italic text-yellow-500 text-xs">Answer pending...</p>
                                    <textarea
                                        className="w-full mt-2 p-2 rounded-md border border-[var(--border-color)] bg-transparent text-sm"
                                        rows="3"
                                        placeholder="Type your answer here..."
                                        value={answerMap[questionId] || ""}
                                        onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleSubmit(questionId)}
                                        disabled={submitting[questionId]}
                                        className="mt-2 px-4 py-2 bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white text-xs rounded-md transition-all"
                                    >
                                        {submitting[questionId] ? "Submitting..." : "Submit Answer"}
                                    </button>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default QuestionAnswerList;
