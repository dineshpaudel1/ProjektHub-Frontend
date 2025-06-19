import { useState } from "react";

const DeliveryLinkModal = ({ isOpen, onClose, onSubmit }) => {
    const [link, setLink] = useState("");

    const handleSubmit = () => {
        if (!link.trim()) {
            alert("Please enter the delivery link.");
            return;
        }
        onSubmit(link);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Enter Delivery Link</h2>
                <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    placeholder="https://your-link.com"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryLinkModal;
