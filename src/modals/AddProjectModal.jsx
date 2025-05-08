import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

const AddProjectModal = ({ isOpen, onClose, onCreate, formData, setFormData }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/users/category', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setCategories(response.data.data);
            } catch (error) {
                console.error('❌ Error fetching categories:', error);
            }
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-xl p-6 w-full max-w-md z-40">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Project</h2>

            <input
                type="text"
                placeholder="Project Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
                placeholder="Project Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select Category</option>
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))
                ) : (
                    <option disabled>No categories found</option>
                )}
            </select>

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
                    Create Project
                </button>
            </div>
        </div>
    );
};

export default AddProjectModal;
