import React from 'react';

const AddCategoryModal = ({ isOpen, onClose, onCreate, categoryName, setCategoryName }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-xl p-6 w-full max-w-sm z-40">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h2>
            <input
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="px-4 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
                <button
                    onClick={onCreate}
                    className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default AddCategoryModal;
