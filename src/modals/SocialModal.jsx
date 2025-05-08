import React from "react";
import { X, Facebook, Instagram, PhoneCall } from "lucide-react"; // Lucide icons

const SocialModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Modal Title */}
                <h2 className="text-xl font-bold mb-4 text-center">Direct Message for Purchase</h2>

                {/* Social Icons with Labels */}
                <div className="flex justify-center space-x-6">
                    {/* WhatsApp */}
                    <div className="flex flex-col items-center">
                        <a
                            href="https://wa.me/9847503434"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-600 transition-all"
                        >
                            <PhoneCall className="h-8 w-8" />
                        </a>
                        <span className="text-sm text-gray-600 mt-1">WhatsApp</span>
                    </div>

                    {/* Facebook */}
                    <div className="flex flex-col items-center">
                        <a
                            href="https://www.facebook.com/satiingraju.sattingraju/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 transition-all"
                        >
                            <Facebook className="h-8 w-8" />
                        </a>
                        <span className="text-sm text-gray-600 mt-1">Facebook</span>
                    </div>

                    {/* Instagram */}
                    <div className="flex flex-col items-center">
                        <a
                            href="https://www.instagram.com/divashpaudel/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-500 hover:text-pink-600 transition-all"
                        >
                            <Instagram className="h-8 w-8" />
                        </a>
                        <span className="text-sm text-gray-600 mt-1">Instagram</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialModal;
