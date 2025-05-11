import React, { useState } from 'react';
import { X, Bot } from 'lucide-react'; // Optional icons

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
                    >
                        <Bot size={24} />
                    </button>
                )}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 h-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                        <h2 className="font-semibold text-sm text-gray-800 dark:text-white">🤖 How can we help?</h2>
                        <button onClick={() => setIsOpen(false)}>
                            <X className="text-gray-500 hover:text-red-500" size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700 dark:text-white">
                        <p>Hi! I'm here to help. Ask me anything about ProjectHub!</p>
                        {/* Add chat messages dynamically later */}
                    </div>

                    {/* Input */}
                    <div className="p-2 border-t dark:border-gray-700">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="w-full px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;
