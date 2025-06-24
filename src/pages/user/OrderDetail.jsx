import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { protectedApi } from "../../services/axiosInstance";  // ✅ updated import

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrderDetails = async () => {
        try {
            const res = await protectedApi.get(`/user/order/${id}`);
            setOrder(res.data.data);
        } catch (err) {
            console.error("Failed to fetch order details", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (!order) return <div className="p-8">Order not found!</div>;

    const { orderType, data } = order;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] px-4 sm:px-8 lg:px-16 py-10">
            <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 hover:underline">← Back</button>
            <h1 className="text-2xl font-bold mb-4">Order Details</h1>

            <div className="border border-gray-300 rounded-lg p-6 shadow">
                <div className="flex justify-between mb-4">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${data.status === "PLACED" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                        {data.status}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">Placed on: {new Date(data.createdAt).toLocaleString()}</p>
                <p className="text-sm mb-2">Order Type: <span className="font-medium text-indigo-600">{orderType}</span></p>
                <p className="text-sm mb-4">Total Price: <span className="font-semibold text-indigo-600">Rs. {data.totalPrice}</span></p>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Order Items:</h3>

                    {orderType === "PREMADE" && data.items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 flex items-center">
                            <img src={`http://localhost:8080/api/media/photo?file=${item.projectThumbnail}`} alt={item.projectTitle} className="w-24 h-24 object-cover rounded mr-4" />
                            <div>
                                <h4 className="font-semibold">{item.projectTitle}</h4>
                                <p className="text-sm text-gray-600">Seller: {item.sellerName}</p>
                                <p className="font-semibold text-indigo-600">Rs. {item.price}</p>
                            </div>
                        </div>
                    ))}

                    {orderType === "CUSTOM" && data.items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold">{item.customTitle}</h4>
                            <p className="text-sm mb-2">{item.customDescription}</p>
                            <div className="mb-2">

                                <ul className="list-disc list-inside">
                                    {item.selectedOptions.map((option, i) => (
                                        <li key={i} className="text-sm">
                                            {option.optionName} - <span className="font-medium text-green-600">{option.status}<span className="font-bold text-xl text-blue-600">   :Price will be here</span></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="font-semibold text-indigo-600">Total Amount: Rs. {item.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
