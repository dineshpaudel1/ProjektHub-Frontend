import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (email === "admin@hub.com" && password === "admin123") {
            localStorage.setItem("role", "admin");
            localStorage.setItem("isAuthenticated", "true");
            navigate("/admin");
        } else {
            setError("Invalid admin credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-md rounded-md p-10 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-8">Admin Login</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form className="space-y-5" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-3 rounded-full border border-gray-300"
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-3 rounded-full border border-gray-300"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-full">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
