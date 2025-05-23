import React, { useEffect, useState } from "react";
import NotificationToast from "../../components/NotificationToast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const UserLogin = () => {
    const [notification, setNotification] = useState(null);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser, setRoles } = useUser();

    useEffect(() => {
        if (window.google) {
            const isDark = document.documentElement.classList.contains("dark");

            window.google.accounts.id.initialize({
                client_id: "12680654953-a51mcs6na6dqs46buci6et88bf8hjt2o.apps.googleusercontent.com",
                callback: handleGoogleCallback,
            });

            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                {
                    theme: isDark ? "filled_black" : "outline",
                    size: "large",
                    width: "100%",
                }
            );
        }
    }, []);


    const handleGoogleCallback = async (response) => {
        const idToken = response.credential;
        try {
            const res = await fetch("http://localhost:8080/api/auth/login/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });

            const data = await res.json();
            if (res.ok && data?.status === "success") {
                localStorage.setItem("token", data.data.accessToken);
                localStorage.setItem("refreshToken", data.data.refreshToken);
                setRoles(data.data.roles);

                const userRes = await fetch("http://localhost:8080/api/user/me", {
                    headers: {
                        Authorization: `Bearer ${data.data.accessToken}`,
                    },
                });
                const userData = await userRes.json();
                console.log(userData)
                setUser(userData);

                setNotification({ type: "success", message: "Login successful!" });
                const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectPath);
            } else {
                throw new Error(data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login failed:", err);
            setNotification({ type: "error", message: err.message || "Something went wrong" });
        }
    };

    const handleManualLogin = async (e) => {
        e.preventDefault();

        if (!identifier || !password) {
            setNotification({ type: "error", message: "Please enter both email and password." });
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/auth/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();
            console.log(data)

            if (res.ok && data?.status === "success") {
                localStorage.setItem("token", data.data.accessToken);
                localStorage.setItem("refreshToken", data.data.refreshToken);

                const userRes = await fetch("http://localhost:8080/api/user/me", {
                    headers: {
                        Authorization: `Bearer ${data.data.accessToken}`,
                    },
                });
                const userData = await userRes.json();
                setUser(userData);
                console.log(userData)

                setNotification({ type: "success", message: "Login successful!" });
                const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectPath);
            } else {
                throw new Error(data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login error:", err);
            setNotification({ type: "error", message: err.message || "Login failed" });
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 font-Doto pt-8"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <NotificationToast
                notification={notification}
                onClose={() => setNotification(null)}
            />
            <div className="flex flex-col justify-center items-center w-full max-w-[480px]">
                <form
                    onSubmit={handleManualLogin}
                    className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-sm 2xl:max-w-sm rounded-xl shadow-md px-6 sm:px-8 py-10 border"

                    style={{
                        backgroundColor: "var(--menu-bg)",
                        borderColor: "var(--border-color)",
                    }}
                >
                    <h2 className="text-2xl font-bold text-center mb-5">Login</h2>

                    <div className="mb-5">
                        <label htmlFor="email" className="block text-base font-semibold mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email or Username"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
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
                            <label htmlFor="password" className="text-base font-semibold">Password</label>
                            <span
                                onClick={() => navigate("/forgot-password")}
                                className="text-sm font-semibold hover:underline cursor-pointer"
                            >
                                Forgot password?
                            </span>
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                                backgroundColor: "var(--bg-color)",
                                color: "var(--text-color)",
                                borderColor: "var(--border-color)",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 text-white bg-blue-600 rounded-full font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>

                    <div className="my-6 flex items-center text-sm" style={{ color: "var(--text-secondary)" }}>
                        <hr className="flex-grow border-t" style={{ borderColor: "var(--border-color)" }} />
                        <span className="mx-3">Or Signin with</span>
                        <hr className="flex-grow border-t" style={{ borderColor: "var(--border-color)" }} />
                    </div>

                    <div id="google-signin-button" className="w-full flex justify-center" />

                    <p className="text-center text-sm mt-6">
                        Don't have an account?{" "}
                        <a href="#" className="font-bold underline">Signup</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;
