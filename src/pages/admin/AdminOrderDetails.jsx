"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../../utils/axiosInstance"
import { toast } from "react-toastify"

const AdminOrderDetails = () => {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchOrderDetails = async () => {
        try {
            const res = await axios.get(`/admin/order/${id}`);
            setOrder(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    const handleProcessOrder = async () => {
        try {
            await axios.post(`/admin/order/${id}/process`);
            toast.success("Order processed successfully");
            fetchOrderDetails();
        } catch (err) {
            console.error(err);
            toast.error("Failed to process order");
        }
    };

    const handleDeliverOrder = async () => {
        try {
            await axios.put(`/admin/order/${id}/deliver`);
            toast.success("Order marked as delivered");
            fetchOrderDetails();
        } catch (err) {
            console.error(err);
            toast.error("Failed to mark as delivered");
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "PLACED":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "COMPLETED":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getButtonConfig = (status) => {
        switch (status) {
            case "PLACED":
                return {
                    text: "Process Order",
                    className: "bg-blue-600 hover:bg-blue-700 text-white",
                    disabled: false,
                }
            case "IN_PROGRESS":
                return {
                    text: "Mark as Delivered",
                    className: "bg-green-600 hover:bg-green-700 text-white",
                    disabled: false,
                }
            case "COMPLETED":
                return {
                    text: "Order Completed ✅",
                    className: "bg-gray-400 text-white cursor-not-allowed",
                    disabled: true,
                }
            default:
                return {
                    text: "Unknown Status",
                    className: "bg-gray-400 text-white cursor-not-allowed",
                    disabled: true,
                }
        }
    }

    useEffect(() => {
        fetchOrderDetails()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading order details...</p>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg">Order not found</p>
                </div>
            </div>
        )
    }

    const buttonConfig = getButtonConfig(order.status)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                            <p className="text-gray-600 mt-1">Manage and track order information</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Summary Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Order ID</label>
                                            <p className="text-gray-900 font-mono">#{id}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Customer Name</label>
                                            <p className="text-gray-900">{order.userFullName}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Customer ID</label>
                                            <p className="text-gray-900 font-mono">{order.userId}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Total Amount</label>
                                            <p className="text-2xl font-bold text-gray-900">₹{order.totalPrice.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ordered Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-900">Ordered Items ({order.items.length})</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div
                                            key={item.itemId}
                                            className={`flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors ${index !== order.items.length - 1 ? "mb-4" : ""
                                                }`}
                                        >
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={`http://localhost:8080/api/media/photo?file=${item.projectThumbnail}`}
                                                    alt={item.projectTitle}
                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Project</label>
                                                        <p className="text-gray-900 font-medium truncate">{item.projectTitle}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Seller</label>
                                                        <p className="text-gray-700">{item.sellerName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price</label>
                                                <p className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-900">Order Actions</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Current Status</label>
                                        <div
                                            className={`mt-1 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(order.status)}`}
                                        >
                                            {order.status}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <button
                                            onClick={
                                                order.status === "PLACED"
                                                    ? handleProcessOrder
                                                    : order.status === "IN_PROGRESS"
                                                        ? handleDeliverOrder
                                                        : null
                                            }
                                            disabled={buttonConfig.disabled}
                                            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${buttonConfig.className}`}
                                        >
                                            {buttonConfig.text}
                                        </button>

                                    </div>

                                    {order.status !== "COMPLETED" && (
                                        <div className="text-xs text-gray-500 text-center">
                                            {order.status === "PLACED" && "Click to process this order"}
                                            {order.status === "IN_PROGRESS" && "Click to mark as delivered"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminOrderDetails
