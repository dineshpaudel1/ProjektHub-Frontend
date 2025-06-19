import React, { useState, useEffect } from "react";

const ProcessCustomOrderModal = ({ isOpen, onClose, selectedOptions, onSubmit }) => {
    const [prices, setPrices] = useState({});

    useEffect(() => {
        // Reset prices when selectedOptions change
        const initialPrices = {};
        selectedOptions.forEach(option => {
            initialPrices[option.optionName] = "";
        });
        setPrices(initialPrices);
    }, [selectedOptions]);

    const handleChange = (optionName, value) => {
        setPrices(prev => ({
            ...prev,
            [optionName]: value,
        }));
    };

    const handleSubmit = () => {
        const parsedPrices = {};
        let valid = true;

        for (const key in prices) {
            const value = parseInt(prices[key]);
            if (isNaN(value) || value <= 0) {
                valid = false;
                alert(`Please enter valid price for ${key}`);
                break;
            }
            parsedPrices[key] = value;
        }

        if (valid) {
            onSubmit(parsedPrices); // send to parent
            onClose(); // close modal
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Set Prices for Selected Options</h2>
                <div className="space-y-4">
                    {selectedOptions.map(option => (
                        <div key={option.optionName}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {option.optionName} Price (₹)
                            </label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder={`Enter price for ${option.optionName}`}
                                value={prices[option.optionName] || ""}
                                onChange={(e) => handleChange(option.optionName, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-6 space-x-3">
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
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProcessCustomOrderModal;
