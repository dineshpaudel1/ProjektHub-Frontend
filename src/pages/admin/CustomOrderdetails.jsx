import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { protectedApi } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import ProcessCustomOrderModal from "../../modals/ProcessCustomOrderModal";
import OptionStatusModal from "../../modals/OptionStatusModal";
import DeliveryLinkModal from "../../modals/DeliveryLinkModal";

const CustomOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusTargetItem, setStatusTargetItem] = useState(null);
    const [statusTargetOption, setStatusTargetOption] = useState(null);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [deliverySubmitting, setDeliverySubmitting] = useState(false); // ✅ Spinner state

    const fetchOrderDetails = async () => {
        try {
            const res = await protectedApi.get(`/admin/order/${id}`);
            const responseData = res.data.data;
            if (responseData.orderType !== "CUSTOM") {
                toast.error("Not a custom order.");
                return;
            }
            setOrder(responseData.data);
        } catch {
            toast.error("Failed to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PLACED": return "bg-yellow-100 text-yellow-800";
            case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
            case "DELIVERED": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getButtonConfig = (status) => {
        switch (status) {
            case "PLACED":
                return { text: "Process Order", className: "bg-blue-600 hover:bg-blue-700 text-white", disabled: false };
            case "IN_PROGRESS":
                return { text: "Mark as Delivered", className: "bg-green-600 hover:bg-green-700 text-white", disabled: false };
            case "DELIVERED":
                return { text: "Order Completed ✅", className: "bg-gray-400 text-white cursor-not-allowed", disabled: true };
            default:
                return { text: "Unknown Status", className: "bg-gray-400 text-white cursor-not-allowed", disabled: true };
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">Loading order details...</div>;
    if (!order) return <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">Order not found</div>;

    const buttonConfig = getButtonConfig(order.status);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Custom Order Details</h1>
                        <p className="text-sm text-blue-600 font-semibold">Order ID: #{id}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50">
                                <h2 className="text-lg font-semibold">Order Summary</h2>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Customer Name</label>
                                    <p className="text-gray-900">{order.userFullName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Customer ID</label>
                                    <p className="text-gray-900 font-mono">{order.userId}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                                    <p className="text-xl font-bold text-gray-900">₹{order.totalPrice.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50">
                                <h2 className="text-lg font-semibold">Ordered Items ({order.items.length})</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.itemId} className="p-4 rounded-lg space-y-2 ">
                                        <p className="text-lg font-semibold text-gray-900">{item.customTitle}</p>
                                        <p className="text-gray-700">{item.customDescription}</p>
                                        <ul className="ml-5 text-gray-800 mb-2 space-y-1">
                                            {item.selectedOptions.map((option, idx) => (
                                                <li key={idx} className="flex items-center justify-between gap-4">
                                                    <span>{option.optionName} — <span className="font-semibold">{option.status}</span></span>
                                                    {order.status === "IN_PROGRESS" && option.status !== "COMPLETED" && (
                                                        <button
                                                            onClick={() => {
                                                                setStatusTargetItem(item);
                                                                setStatusTargetOption(option);
                                                                setShowStatusModal(true);
                                                            }}
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            Update Status
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm sticky top-8">
                            <div className="px-6 py-4 bg-gray-50">
                                <h2 className="text-lg font-semibold">Order Actions</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Current Status</label>
                                    <div className={`mt-1 px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (order.status === "PLACED") {
                                            setShowProcessModal(true);
                                        } else if (order.status === "IN_PROGRESS") {
                                            setShowDeliveryModal(true);
                                        }
                                    }}
                                    disabled={buttonConfig.disabled || deliverySubmitting}
                                    className={`w-full px-4 py-3 border rounded-lg font-medium transition-colors flex justify-center items-center gap-2 ${buttonConfig.className}`}
                                >
                                    {deliverySubmitting && <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />}
                                    {buttonConfig.text}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Process Modal */}
            {showProcessModal && (
                <ProcessCustomOrderModal
                    isOpen={showProcessModal}
                    onClose={() => setShowProcessModal(false)}
                    selectedOptions={order.items.flatMap(item => item.selectedOptions)}
                    onSubmit={async (priceData) => {
                        try {
                            for (let item of order.items) {
                                await protectedApi.post(`/admin/order/${item.itemId}/custom`, priceData);
                            }
                            toast.success("Custom order processed");
                            setShowProcessModal(false);
                            fetchOrderDetails();
                        } catch {
                            toast.error("Failed to process order items");
                        }
                    }}
                />
            )}

            {/* Option Status Modal */}
            {showStatusModal && statusTargetItem && statusTargetOption && (
                <OptionStatusModal
                    isOpen={showStatusModal}
                    optionName={statusTargetOption.optionName}
                    currentStatus={statusTargetOption.status}
                    isLastIncompleteOption={
                        statusTargetItem.selectedOptions.filter(opt => opt.status !== "COMPLETED").length === 1 &&
                        statusTargetOption.status !== "COMPLETED"
                    }
                    onClose={() => {
                        setStatusTargetItem(null);
                        setStatusTargetOption(null);
                        setShowStatusModal(false);
                    }}
                    onSubmit={async ({ optionName, newStatus }) => {
                        try {
                            await protectedApi.post(`/admin/order/order-item/${statusTargetItem.itemId}/option-status`, {
                                optionName,
                                status: newStatus
                            });
                            toast.success(`${optionName} marked ${newStatus}`);
                            fetchOrderDetails();
                        } catch {
                            toast.error("Failed to update status");
                        }
                    }}
                />
            )}

            {/* Delivery Modal */}
            {showDeliveryModal && (
                <DeliveryLinkModal
                    isOpen={showDeliveryModal}
                    onClose={() => setShowDeliveryModal(false)}
                    onSubmit={async (link) => {
                        try {
                            setDeliverySubmitting(true);
                            const itemId = order.items[0].itemId;
                            await protectedApi.post(`/admin/order/admin/custom/${itemId}/deliver`, {
                                deliveryLink: link
                            });
                            toast.success("Order marked as delivered!");
                            setShowDeliveryModal(false);
                            fetchOrderDetails();
                        } catch {
                            toast.error("Failed to deliver order");
                        } finally {
                            setDeliverySubmitting(false);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default CustomOrderDetails;
