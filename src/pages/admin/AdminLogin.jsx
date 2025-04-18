import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/api/auth/admin/login", {
                identifier,
                password,
            });

            const { accessToken, refreshToken } = response.data.data;
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("isAuthenticated", "true");

            navigate("/admin");
        } catch (err) {
            console.error(err);
            setError("Invalid credentials or server error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center pt-8 font-primary px-4"
            style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
            }}
        >
            <div
                className="w-full max-w-sm rounded-xl shadow-md px-6 py-10 border"
                style={{
                    backgroundColor: "var(--menu-bg)",
                    borderColor: "var(--border-color)",
                }}
            >
                {/* Title */}
                <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

                {/* Error */}
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            placeholder="admin@example.com"
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

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
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
                        disabled={loading}
                        className="w-full py-2.5 text-white font-semibold rounded-full transition duration-200"
                        style={{
                            backgroundColor: "var(--button-primary)",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--button-primary-hover)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--button-primary)";
                        }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
