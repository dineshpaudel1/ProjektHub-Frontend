import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { MessageCircle } from 'lucide-react';

const QnASection = ({ projectId }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(null);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`/public/project/${projectId}/interactions`);
            setQuestions(res.data.data || []);
        } catch (err) {
            console.error('Error fetching questions:', err);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [projectId]);

    const handleAnswerChange = (id, text) => {
        setAnswers((prev) => ({ ...prev, [id]: text }));
    };

    const handleSubmitAnswer = async (questionId) => {
        const token = localStorage.getItem('token');
        if (!token) return alert("Unauthorized");

        const answer = answers[questionId];
        if (!answer?.trim()) return;

        setSubmitting(questionId);
        try {
            await axios.post(`/api/seller/project/${projectId}/answer/${questionId}`, {
                answerText: answer
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            await fetchQuestions();
            setAnswers((prev) => ({ ...prev, [questionId]: '' }));
        } catch (err) {
            console.error('Failed to submit answer:', err);
        } finally {
            setSubmitting(null);
        }
    };

    return (
        <div>
            <h2 className="flex items-center text-xl font-semibold mb-4">
                <MessageCircle className="h-5 w-5 mr-2" />
                Questions & Answers
            </h2>
            {questions.length === 0 ? (
                <p className="text-sm text-gray-600">No questions yet.</p>
            ) : (
                <ul className="grid grid-cols-1 gap-4">
                    {questions.map((q) => {
                        const date = new Date(q.createdAt).toLocaleString('en-US', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        });

                        return (
                            <li key={q.id} className="bg-gray-100 p-4 rounded-lg text-sm space-y-2">
                                <div>
                                    <p className="font-medium text-gray-800">Q: {q.questionText}</p>
                                    <p className="text-xs text-gray-500">Asked by: {q.askedBy} on {date}</p>
                                </div>
                                {q.answerText ? (
                                    <div className="mt-2 border-t pt-2 border-gray-300">
                                        <p className="text-green-700 font-medium">A: {q.answerText}</p>
                                        <p className="text-xs text-gray-500">Answered by: {q.answeredBy}</p>
                                    </div>
                                ) : (
                                    <div className="mt-2 space-y-2">
                                        <textarea
                                            className="w-full p-2 border rounded"
                                            rows={2}
                                            placeholder="Write your answer..."
                                            value={answers[q.id] || ''}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleSubmitAnswer(q.id)}
                                            disabled={submitting === q.id}
                                            className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800"
                                        >
                                            {submitting === q.id ? 'Submitting...' : 'Submit Answer'}
                                        </button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default QnASection;
