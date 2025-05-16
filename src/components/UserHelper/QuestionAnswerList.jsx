import React from "react";
import { MessageCircle } from "lucide-react";

const UserQuestionAnswerList = ({ questions }) => {
    if (!questions || questions.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="flex items-center text-xl font-semibold mb-4">
                <MessageCircle className="h-5 w-5 mr-2" />
                Questions & Answers
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {questions.map((q, idx) => {
                    const askedDate = new Date(q.createdAt).toLocaleString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    return (
                        <li
                            key={idx}
                            className="bg-[var(--hover-bg)] border border-[var(--border-color)] p-4 rounded-lg text-sm shadow-md space-y-2"
                        >
                            <div>
                                <p className="font-medium text-[var(--text-color)]">Q: {q.questionText}</p>
                                <p className="text-xs text-gray-500">
                                    Asked by: {q.askedBy} on {askedDate}
                                </p>
                            </div>
                            {q.answerText ? (
                                <div className="mt-2 border-t pt-2 border-gray-300 dark:border-gray-600">
                                    <p className="font-medium text-[var(--button-primary-hover)]">
                                        A: {q.answerText}
                                    </p>
                                    <p className="text-xs text-gray-500">Answered by: {q.answeredBy}</p>
                                </div>
                            ) : (
                                <p className="italic text-yellow-500 text-xs">Answer pending...</p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default UserQuestionAnswerList;
