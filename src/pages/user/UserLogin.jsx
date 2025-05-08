import React, { useEffect, useState } from "react";
import NotificationToast from "../../porjectdetailhelper/NotificationToast";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        /* global google */
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: "12680654953-a51mcs6na6dqs46buci6et88bf8hjt2o.apps.googleusercontent.com",
                callback: handleGoogleCallback,
            });

            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: "outline", size: "large", width: "100%" }
            );
        }
    }, []);

    const handleGoogleCallback = async (response) => {
        const idToken = response.credential;


        try {
            const res = await fetch("http://localhost:8080/api/auth/login/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: idToken }),
            });

            const data = await res.json();
            console.log(data)

            if (res.ok) {
                // ✅ Store token and user info
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("user", "dinesh paudel");

                setNotification({ type: "success", message: "Login successful!" });

                // ✅ Redirect after short delay
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                throw new Error(data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login failed:", err);
            setNotification({ type: "error", message: err.message || "Something went wrong" });
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center font-Doto pt-8"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            {/* Notification */}
            <NotificationToast
                notification={notification}
                onClose={() => setNotification(null)}
            />

            <div
                className="w-full max-w-sm rounded-xl shadow-md px-6 py-10 border"
                style={{
                    backgroundColor: "var(--menu-bg)",
                    borderColor: "var(--border-color)",
                }}
            >
                <h2 className=" text-2xl font-bold text-center mb-5">Login</h2>

                <div className="mb-5">
                    <label htmlFor="email" className="block text-base font-semibold mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email or Username"
                        className="w-full px-4 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            color: "var(--text-color)",
                            borderColor: "var(--border-color)",
                        }}
                    />
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password" className="text-base font-semibold">
                            Password
                        </label>
                        <a href="#" className="text-sm font-semibold hover:underline">
                            forget password?
                        </a>
                    </div>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            color: "var(--text-color)",
                            borderColor: "var(--border-color)",
                        }}
                    />
                </div>

                <button className="w-full py-2.5 text-white bg-blue-600 rounded-full font-semibold hover:bg-blue-700 transition duration-200">
                    Login
                </button>

                <div className="my-6 flex items-center text-sm" style={{ color: "var(--text-secondary)" }}>
                    <hr className="flex-grow border-t" style={{ borderColor: "var(--border-color)" }} />
                    <span className="mx-3">Or Signin with</span>
                    <hr className="flex-grow border-t" style={{ borderColor: "var(--border-color)" }} />
                </div>

                {/* Google Login Rendered Here */}
                <div id="google-signin-button" className="w-full flex justify-center" />

                <p className="text-center text-sm mt-6">
                    Don't have an account?{" "}
                    <a href="#" className="font-bold underline">
                        Signup
                    </a>
                </p>
            </div>
        </div>
    );
};

export default UserLogin;
