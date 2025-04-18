import React from "react";

const UserLogin = () => {
    return (
        <div
            className="min-h-screen flex items-center justify-center font-Doto pt-8"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <div
                className="w-full max-w-sm rounded-xl shadow-md px-6 py-10 border"
                style={{
                    backgroundColor: "var(--menu-bg)",
                    borderColor: "var(--border-color)",
                }}
            >
                {/* Title */}
                <h2 className=" text-2xl font-bold text-center mb-5">Login</h2>

                {/* Email */}
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

                {/* Password */}
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

                {/* Login Button */}
                <button className="w-full py-2.5 text-white bg-blue-600 rounded-full font-semibold hover:bg-blue-700 transition duration-200">
                    Login
                </button>

                {/* Divider */}
                <div className="my-6 flex items-center text-sm" style={{ color: "var(--text-secondary)" }}>
                    <hr className="flex-grow border-t" style={{ borderColor: "var(--border-color)" }} />
                    <span className="mx-3">Or Signin with</span>
                    <hr className="flex-grow border-t" style={{ borderColor: "var(--border-color)" }} />
                </div>

                {/* Google Login */}
                <button
                    className="w-full flex items-center justify-center gap-3 border rounded-full py-2 text-sm font-semibold hover:bg-gray-100 transition"
                    style={{
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                        borderColor: "var(--border-color)",
                    }}
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="google"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button>

                {/* Signup Text */}
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
