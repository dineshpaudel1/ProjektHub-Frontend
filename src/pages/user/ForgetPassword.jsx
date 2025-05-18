import React, { useState } from "react";
import NotificationToast from "../../components/NotificationToast";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1 = send email, 2 = verify OTP, 3 = reset password
    const navigate = useNavigate();

    const handleSendResetLink = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await axios.post("/auth/forgot-password", { email });
            setNotification({
                type: "success",
                message: res.data.message || "Reset link or OTP sent to your email.",
            });
            setStep(2);
        } catch (err) {
            console.error(err);
            setNotification({
                type: "error",
                message: err.response?.data?.message || "Error sending reset link.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            return setNotification({ type: "error", message: "Please enter the OTP." });
        }

        setIsSubmitting(true);
        try {
            const res = await axios.post("/auth/verify-otp", {
                email,
                otpCode: otp,
            });

            setNotification({
                type: "success",
                message: res.data.message || "OTP verified successfully!",
            });

            // Move to reset password step
            setStep(3);
        } catch (err) {
            console.error(err);
            setNotification({
                type: "error",
                message: err.response?.data?.message || "Invalid or expired OTP.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setNotification({ type: "error", message: "Passwords do not match." });
        }

        setIsSubmitting(true);
        try {
            const res = await axios.post("/auth/reset-password", {
                email,
                newPassword,
            });

            setNotification({
                type: "success",
                message: res.data.message || "Password reset successful. Redirecting to login...",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            console.error(err);
            setNotification({
                type: "error",
                message: err.response?.data?.message || "Error resetting password.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-Doto px-4 pt-8">
            <NotificationToast
                notification={notification}
                onClose={() => setNotification(null)}
            />

            <form
                onSubmit={
                    step === 1
                        ? handleSendResetLink
                        : step === 2
                            ? handleVerifyOtp
                            : handleResetPassword
                }
                className="w-full max-w-sm rounded-xl shadow-md px-6 py-10 border"
                style={{
                    backgroundColor: "var(--menu-bg)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                }}
            >
                <h2 className="text-2xl font-bold text-center mb-5">
                    {step === 1
                        ? "Forgot Password"
                        : step === 2
                            ? "Verify OTP"
                            : "Reset Password"}
                </h2>

                {step === 1 && (
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-base font-semibold mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                                backgroundColor: "var(--bg-color)",
                                color: "var(--text-color)",
                                borderColor: "var(--border-color)",
                            }}
                        />
                    </div>
                )}

                {step === 2 && (
                    <>
                        <p className="text-sm mb-4">
                            We’ve sent an OTP to <strong>{email}</strong>. Enter it below:
                        </p>
                        <div className="mb-5">
                            <label htmlFor="otp" className="block text-base font-semibold mb-1">
                                OTP Code
                            </label>
                            <input
                                id="otp"
                                type="text"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center"
                                style={{
                                    backgroundColor: "var(--bg-color)",
                                    color: "var(--text-color)",
                                    borderColor: "var(--border-color)",
                                    letterSpacing: "0.1em",
                                }}
                            />
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="mb-5">
                            <label htmlFor="newPassword" className="block text-base font-semibold mb-1">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{
                                    backgroundColor: "var(--bg-color)",
                                    color: "var(--text-color)",
                                    borderColor: "var(--border-color)",
                                }}
                            />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="confirmPassword" className="block text-base font-semibold mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{
                                    backgroundColor: "var(--bg-color)",
                                    color: "var(--text-color)",
                                    borderColor: "var(--border-color)",
                                }}
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full py-2.5 text-white bg-blue-600 rounded-full font-semibold hover:bg-blue-700 transition duration-200"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Please wait..."
                        : step === 1
                            ? "Send Reset Link"
                            : step === 2
                                ? "Verify OTP"
                                : "Reset Password"}
                </button>

                <p className="text-center text-sm mt-6">
                    Back to{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="font-bold underline cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
