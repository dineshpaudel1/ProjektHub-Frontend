import { useState } from "react";

const OptionStatusModal = ({
    isOpen,
    onClose,
    optionName,
    currentStatus,
    onSubmit
}) => {
    const [newStatus, setNewStatus] = useState(currentStatus);

    const handleSubmit = () => {
        onSubmit({
            optionName,
            newStatus
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Update Status for {optionName}</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">New Status</label>
                    <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OptionStatusModal;
