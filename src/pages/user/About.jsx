import React, { useState } from "react";
import about from "../../assets/images/about.png";
import CustomOrderModal from "../../modals/CustomOrderModal"; // ✅ adjust path if needed

export default function About() {
    // --- modal state ----------------------------------------------------------
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {/* ---------- Main Section ---------- */}
            <section
                id="about"
                className="w-full px-4 sm:px-6 lg:px-16 py-20 sm:py-24"
                style={{ backgroundColor: "var(--bg-color)" }}
            >
                {/* Header */}
                <div className="max-w-7xl mx-auto text-center">
                    <h2
                        className="text-3xl sm:text-4xl font-bold mb-6"
                        style={{ color: "var(--text-color)" }}
                    >
                        About <span style={{ color: "var(--button-primary)" }}>Us</span>
                    </h2>
                    <div className="h-1 w-40 mx-auto mt-2 mb-6 bg-[#5454D4] rounded-full"></div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* ---- Text side ---- */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <h3
                                    className="text-3xl sm:text-4xl font-bold leading-tight"
                                    style={{ color: "var(--text-color)" }}
                                >
                                    We Make Your{" "}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">Ideas</span>
                                        <span className="absolute inset-0 -bottom-2 h-3 bg-yellow-200 z-0 rounded-full transform -rotate-10 mt-10"></span>
                                    </span>{" "}
                                    Come to Life
                                </h3>

                                <p
                                    className="text-lg leading-relaxed"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    We use creativity and cutting-edge technology to help students
                                    and businesses bring their visions to reality. From final-year
                                    projects to scalable enterprise platforms, we craft each
                                    solution with precision, care, and innovation.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    {
                                        iconBg: "bg-blue-100",
                                        iconColor: "text-blue-600",
                                        title: "Fast Development",
                                        desc: "Quick turnaround without compromising quality",
                                    },
                                    {
                                        iconBg: "bg-green-100",
                                        iconColor: "text-green-600",
                                        title: "Quality Assured",
                                        desc: "Rigorous testing and attention to detail",
                                    },
                                    {
                                        iconBg: "bg-purple-100",
                                        iconColor: "text-purple-600",
                                        title: "Expert Team",
                                        desc: "Experienced developers and designers",
                                    },
                                    {
                                        iconBg: "bg-orange-100",
                                        iconColor: "text-orange-600",
                                        title: "24/7 Support",
                                        desc: "Continuous support and maintenance",
                                    },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div
                                            className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}
                                        >
                                            <svg
                                                className={`w-4 h-4 ${item.iconColor}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d={
                                                        idx === 0
                                                            ? "M13 10V3L4 14h7v7l9-11h-7z"
                                                            : idx === 1
                                                                ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                : idx === 2
                                                                    ? "M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0zM17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M17 20H7"
                                                                    : "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
                                                    }
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4
                                                className="font-semibold mb-1"
                                                style={{ color: "var(--text-color)" }}
                                            >
                                                {item.title}
                                            </h4>
                                            <p
                                                className="text-sm"
                                                style={{ color: "var(--text-secondary)" }}
                                            >
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="pt-4">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="inline-flex items-center text-white px-8 py-3 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    style={{ backgroundColor: "var(--button-primary)" }}
                                >
                                    Let&apos;s Build Together
                                    <svg
                                        className="w-5 h-5 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* ---- Image side ---- */}
                        <div className="relative">
                            <div className="absolute -top-8 -right-8 w-full h-full">
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl transform rotate-3"></div>
                            </div>
                            <div
                                className="relative z-10 p-4 rounded-2xl shadow-2xl"
                                style={{ backgroundColor: "var(--bg-color)" }}
                            >
                                <img
                                    src={about}
                                    alt="Team working on innovative projects"
                                    className="w-full h-auto rounded-xl object-cover"
                                />

                                {/* bottom-left stat */}
                                <div
                                    className="absolute -bottom-6 -left-6 rounded-xl shadow-lg p-4 border"
                                    style={{
                                        backgroundColor: "var(--bg-color)",
                                        borderColor: "var(--border-color)",
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p
                                                className="text-2xl font-bold"
                                                style={{ color: "var(--text-color)" }}
                                            >
                                                10+
                                            </p>
                                            <p
                                                className="text-sm"
                                                style={{ color: "var(--text-secondary)" }}
                                            >
                                                Projects Completed
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* top-right stat */}
                                <div
                                    className="absolute -top-6 -right-6 rounded-xl shadow-lg p-4 border"
                                    style={{
                                        backgroundColor: "var(--bg-color)",
                                        borderColor: "var(--border-color)",
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p
                                                className="text-2xl font-bold"
                                                style={{ color: "var(--text-color)" }}
                                            >
                                                1+
                                            </p>
                                            <p
                                                className="text-sm"
                                                style={{ color: "var(--text-secondary)" }}
                                            >
                                                Years&nbsp;Experience
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- Modal (portal-style) ---------- */}
            <CustomOrderModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
}
