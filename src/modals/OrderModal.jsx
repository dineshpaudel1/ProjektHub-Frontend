import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { protectedApi } from "../services/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import logo from "../assets/images/logoblack.png";

const OrderModal = ({ isOpen, onClose, selectedProject }) => {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate();
    const modalRef = useRef();
    const pdfRef = useRef();

    const isPhoneValid = /^\d{10}$/.test(phoneNumber);

    const handleProceed = () => {
        if (!isPhoneValid) return;
        setStep(2);
    };

    const handleDownloadPdf = () => {
        if (!pdfRef.current) return;
        html2pdf()
            .set({
                margin: 0.5,
                filename: `order-${user?.fullName || "guest"}-${Date.now()}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            })
            .from(pdfRef.current)
            .save();
    };

    const handleConfirm = async () => {
        if (!selectedProject?.id || !phoneNumber.trim()) return;

        const payload = {
            userPhoneNumber: phoneNumber,
            items: [{ projectId: selectedProject.id, quantity: 1 }],
        };

        try {
            setLoading(true);
            const res = await protectedApi.post("/user/order", payload);
            if (res.data.statusCode === 200) {
                toast.success("Order placed successfully!");
                setTimeout(() => {
                    onClose();
                    navigate("/my-orders");
                }, 1000);
            } else {
                toast.error("Something went wrong.");
            }
        } catch (err) {
            console.error("Order error:", err);
            toast.error("Order failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setPhoneNumber("");
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen || !selectedProject) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 backdrop-blur-sm bg-black/10 font-[var(--font-primary)]">
            <div
                ref={modalRef}
                className="bg-[var(--bg-color)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg w-full max-w-3xl shadow-xl px-8 py-6 max-h-[90vh] overflow-y-auto"
            >
                {step === 1 ? (
                    <>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-5 text-2xl font-bold"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-semibold text-center mb-6">
                            Contact Info
                        </h2>
                        <label className="block text-base font-medium mb-2">
                            Phone number
                        </label>
                        <input
                            type="number"
                            placeholder="Enter WhatsApp or Viber number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.slice(0, 10))}
                            className="w-full border border-[var(--border-color)] px-4 py-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] bg-transparent"
                        />
                        {!isPhoneValid && phoneNumber && (
                            <p className="text-red-500 text-sm mb-4">
                                Must be exactly 10 digits.
                            </p>
                        )}
                        <div className="text-center">
                            <button
                                onClick={handleProceed}
                                disabled={!isPhoneValid}
                                className="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white text-lg font-semibold px-6 py-3 rounded-full transition-all disabled:opacity-50"
                            >
                                Proceed to Order
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div ref={pdfRef}>
                            <div className="flex justify-between items-start mb-6">
                                <img src={logo} alt="Logo" className="h-10 object-contain" />
                                <p className="text-sm font-medium">
                                    Date: {new Date().toISOString().slice(0, 10)}
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="text-lg font-medium">
                                    Order by: {user?.fullName || "Guest"}
                                </p>
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
                                    <p className="text-lg font-bold">
                                        Title: {selectedProject.title}
                                    </p>
                                    <p className="text-base">By: {selectedProject.seller.name}</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p>Price: NPR {selectedProject.price}</p>
                                    <p>Qty: 1</p>
                                </div>
                            </div>

                            <hr className="my-4 border-[var(--border-color)]" />
                            <p className="text-xs italic text-[var(--text-secondary)] mb-4">
                                You’ll be notified via email after confirmation.
                            </p>
                            <div className="text-right font-semibold text-lg mb-6">
                                Total: NPR {selectedProject.price}
                            </div>
                        </div>

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
