import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { notifySuccess, notifyError } from '../../utils/toastNotify';
import { publicApi, protectedApi } from "../../services/axiosInstance";

const UserLogin = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser, setRoles } = useUser();

    useEffect(() => {
        if (window.google) {
            const isDark = document.documentElement.classList.contains("dark");
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleCallback,
            });
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: isDark ? "filled_black" : "outline", size: "large", width: "100%" }
            );
        }
    }, []);

    const handleGoogleCallback = async (response) => {
        const idToken = response.credential;
        try {
            const res = await publicApi.post('/auth/login/google', { token: idToken });
            const { accessToken, refreshToken, roles } = res?.data?.data;

            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            setRoles(roles);

            const userRes = await protectedApi.get('/user/me');
            setUser(userRes.data);
            notifySuccess("Login Success");
            const redirectPath = location.state?.from || localStorage.getItem("redirectAfterLogin") || "/";
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath);

        } catch (err) {
            console.error("Google login failed:", err);
            notifyError("Something went wrong during Google login.");
        }
    };

    const handleManualLogin = async (e) => {
        e.preventDefault();
        if (!identifier || !password) {
            notifyError("Please enter both email and password.");
            return;
        }
        try {
            const res = await publicApi.post('/auth/user/login', { identifier, password });
            const { accessToken, refreshToken } = res.data.data;

            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            const userRes = await protectedApi.get('/user/me');
            setUser(userRes.data);

            notifySuccess("Login successful!");
            const redirectPath = location.state?.from || localStorage.getItem("redirectAfterLogin") || "/";
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath);

        } catch (err) {
            console.error("Manual login error:", err);
            notifyError(err?.response?.data?.message || "Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 font-Doto pt-8"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
            <div className="flex flex-col justify-center items-center w-full max-w-[480px]">
                <form onSubmit={handleManualLogin}
                    className="w-full max-w-sm rounded-xl shadow-md px-6 py-10 border"
                    style={{ backgroundColor: "var(--menu-bg)", borderColor: "var(--border-color)" }}
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
                            className="w-full px-4 py-2.5 border rounded-md text-sm"
                            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)", borderColor: "var(--border-color)" }}
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="text-base font-semibold">Password</label>
                            <span onClick={() => navigate("/forgot-password")} className="text-sm font-semibold hover:underline cursor-pointer">
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
                            className="w-full px-4 py-2.5 border rounded-md text-sm"
                            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)", borderColor: "var(--border-color)" }}
                        />
                    </div>

                    <button type="submit"
                        className="w-full py-2.5 text-white bg-blue-600 rounded-full font-semibold hover:bg-blue-700">
                        Login
                    </button>

                    <div className="my-6 flex items-center text-sm" style={{ color: "var(--text-secondary)" }}>
                        <hr className="flex-grow border-t" style={{ borderColor: "var(--border-color)" }} />
                        <span className="mx-3">Or Signin with</span>
                        <hr className="flex-grow border-t" style={{ borderColor: "var(--border-color)" }} />
                    </div>

                    <div id="google-signin-button" className="w-full flex justify-center" />

                    <p className="text-center text-sm mt-6">
                        Don't have an account? <a href="#" className="font-bold underline">Signup</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;
