import React from "react";
import heroperson from "../../assets/images/heroperson.png";

const ServicesSection = () => {
    return (
        <section
            className="py-20 px-4 sm:px-6 lg:px-16"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            {/* ONLY Center "Services" title */}
            <div className="flex justify-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold border-b-4 border-[#5454D4] pb-1">
                    Services
                </h2>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
                {/* LEFT: Text Content */}
                <div className="text-left">
                    <h3 className="text-3xl sm:text-4xl font-extrabold mb-4">
                        We Take <br /> Custom Order
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                        We will build project for your Major Project and secure your full
                        potential with us and make sure to perfect and i love you
                    </p>
                    <button
                        className="px-6 py-3 font-semibold text-white rounded-md transition"
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
                        Place Order
                    </button>
                </div>

                {/* RIGHT: Image */}
                <div className="flex justify-center md:justify-end">
                    <img
                        src={heroperson}
                        alt="Hero Person"
                        className="w-[80%] max-w-xs sm:max-w-sm md:max-w-md"
                    />
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
