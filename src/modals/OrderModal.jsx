import React, { useState, useEffect, useRef } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { useUser } from "../context/UserContext";
import axios from "../utils/axiosInstance";
import logo from '../assets/images/logoblack.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';


const OrderModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const isPhoneValid = /^\d{10}$/.test(phoneNumber);



    const { selectedProject } = useProjectContext();
    const { user } = useUser();
    const navigate = useNavigate();
    const modalRef = useRef();
    const pdfRef = useRef(null);


    const handleProceed = () => {
        if (!phoneNumber.trim()) return;
        setStep(2);
    };

    const handleDownloadPdf = () => {
        if (!pdfRef.current) return;

        const opt = {
            margin: 0.5,
            filename: `order-${user?.fullName || 'guest'}-${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(pdfRef.current).save();
    };

    const handleConfirm = async () => {
        if (!selectedProject?.id || !phoneNumber.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login again.");
            return;
        }

        const payload = {
            userPhoneNumber: phoneNumber,
            items: [
                {
                    projectId: selectedProject.id,
                    quantity: 1
                }
            ]
        };

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:8080/api/user/order",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (response.data.statusCode === 200) {
                toast.success("Your order placed successfully. Wait for response.");
                // handleDownloadPdf();
                onClose(); // Close modal
                navigate("/my-orders"); // Redirect to MyOrder.jsx
            } else {
                toast.error("Something went wrong. Try again.");
            }

        } catch (err) {
            console.error("Order failed:", err);
            toast.error("Order failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setPhoneNumber('');
            setLoading(false);
        }
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 backdrop-blur-sm bg-black/10 font-[var(--font-primary)]">
            <div
                ref={modalRef}
                className="bg-[var(--bg-color)] rounded-lg w-full max-w-3xl shadow-xl relative px-8 py-6 text-[var(--text-color)] max-h-[90vh] overflow-y-auto"
            >
                {step === 1 ? (
                    <>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-5 text-2xl font-bold text-[var(--text-color)]"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-semibold text-center mb-6">Contact</h2>
                        <label className="block text-base font-medium mb-2">Phone number</label>
                        <input
                            type="number"
                            placeholder="Please Enter Your Whatsapp/Viber Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.slice(0, 10))} // limit to 10 digits
                            className="w-full border border-[var(--border-color)] px-4 py-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] bg-transparent"
                        />
                        {!isPhoneValid && phoneNumber && (
                            <p className="text-red-500 text-sm mb-4">Phone number must be exactly 10 digits.</p>
                        )}
                        <div className="text-center">
                            <button
                                onClick={handleProceed}
                                className="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white text-lg font-semibold px-6 py-3 rounded-full transition-all disabled:opacity-50"
                                disabled={!isPhoneValid}
                            >
                                Proceed to order
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div ref={pdfRef}>
                            {/* ✅ Full Order Summary Content for PDF */}
                            <div className="flex justify-between items-start mb-6">
                                <img src={logo} alt="Logo" className="h-10 object-contain" />
                                <p className="text-sm font-medium">Date: {new Date().toISOString().slice(0, 10)}</p>
                            </div>

                            <div className="mb-6">
                                <p className="text-lg font-medium">Order by: {user?.fullName || "Guest"}</p>
                                <p className="text-base">Contact no: {phoneNumber}</p>
                            </div>

                            <div className="flex items-start mb-6">
                                <span className="text-xl font-semibold mr-3">1.</span>
                                <img
                                    src={`http://localhost:8080/api/media/photo?file=${selectedProject.thumbnail}`}
                                    alt="project"
                                    className="w-20 h-20 object-cover rounded mr-4"
                                />
                                <div className="flex-1">
                                    <p className="text-lg font-bold">Title: {selectedProject?.title}</p>
                                    <p className="text-base">By: {selectedProject?.seller.name}</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p>Price: NPR {selectedProject?.price}</p>
                                    <p>Qty: 1</p>
                                </div>
                            </div>

                            <hr className="my-4 border-[var(--border-color)]" />
                            <p className="text-xs italic text-[var(--text-secondary)] mb-4">
                                Note: You will be notified via mail
                            </p>

                            <div className="text-right font-semibold text-lg mb-6">
                                Total: NPR {selectedProject?.price}
                            </div>
                        </div>

                        {/* ✅ Action Buttons */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={onClose}
                                className="border border-[var(--border-color)] text-[var(--text-color)] px-6 py-2 rounded-lg hover:bg-[var(--hover-bg)] text-sm font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                            >
                                {loading ? "Placing Order..." : "Confirm"}
                            </button>
                        </div>

                        {/* ✅ PDF Download Button */}
                        <div className="text-center mt-6">
                            <button
                                onClick={handleDownloadPdf}
                                className="text-[var(--button-primary)] underline text-sm hover:text-[var(--button-primary-hover)]"
                            >
                                ⬇️ Download Order Summary as PDF
                            </button>
                        </div>

                        <div className="text-xs text-[var(--text-secondary)] mt-8 flex justify-between">
                            <span>www.projekthub.com</span>
                            <span>Contact: {phoneNumber}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderModal;
