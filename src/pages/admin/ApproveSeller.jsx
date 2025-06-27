import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { protectedApi } from "../../services/axiosInstance";

const ApproveSeller = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);

    useEffect(() => {
        const fetchSellerDetails = async () => {
            try {
                const res = await protectedApi.get(`/admin/sellers/${sellerId}`);
                setSeller(res.data.data);
            } catch (error) {
                console.error("Error fetching seller details:", error);
            }
        };

        fetchSellerDetails();
    }, [sellerId]);

    const handleApprove = async () => {
        try {
            await protectedApi.put(`/admin/sellers/${sellerId}/approve`);
            alert("Seller approved!");
            navigate("/admin");
        } catch (error) {
            console.error("Approval failed:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await protectedApi.delete(`/admin/sellers/${sellerId}`);
            alert("Seller deleted.");
            navigate("/admin");
        } catch (error) {
            console.error("Deletion failed:", error);
        }
    };

    if (!seller) return <div className="p-6">Loading seller info...</div>;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 shadow-lg rounded-lg border bg-white">
            <h2 className="text-xl font-bold mb-4">Approve Seller</h2>
            <div className="flex gap-4">
                <img
                    src={`${import.meta.env.VITE_API_URL}/media/photo?file=${seller.verificationPhotoPath}`}
                    alt="Verification"
                    className="w-40 h-40 object-cover rounded border"
                />
                <div className="space-y-2">
                    <p><strong>Name:</strong> {seller.sellerName}</p>
                    <p><strong>Email:</strong> {seller.email}</p>
                    <p><strong>Phone:</strong> {seller.phone}</p>
                    <p><strong>Title:</strong> {seller.professionalTitle}</p>
                    <p><strong>Bio:</strong> {seller.bio}</p>
                    <p><strong>Skills:</strong> {seller.skills.join(", ")}</p>
                    <p><strong>Status:</strong> {seller.status}</p>
                </div>
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Approve
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ApproveSeller;
