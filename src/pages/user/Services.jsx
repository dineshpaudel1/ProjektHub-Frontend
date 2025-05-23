import React, { useEffect, useState } from "react";
import white from "../../assets/images/photo.png";
import dark from "../../assets/images/photowhite.png";

const ServicesSection = () => {
    const [themeImage, setThemeImage] = useState(white);

    useEffect(() => {
        const updateImage = () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            setThemeImage(currentTheme === "dark" ? dark : white);
        };

        updateImage(); // Initial
        const observer = new MutationObserver(updateImage);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="services"
            className="py-20 px-4 sm:px-6 lg:px-16"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            {/* Section Title */}
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold inline-block relative pb-2">
                    Services
                    <span className="absolute left-1/2 -bottom-1 w-24 h-1 bg-[#5454D4] rounded-full -translate-x-1/2"></span>
                </h2>
            </div>

            {/* Content Grid */}
            {/* Content Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Image - appears first on mobile */}
                <div className="order-1 md:order-2 flex justify-center md:justify-end pl-4 md:pl-12 lg:pl-24">
                    <img
                        src={themeImage}
                        alt="Service Illustration"
                        className="w-[80%] sm:w-[60%] md:w-[400px] lg:w-[350px] object-contain rounded-[2rem]"
                    />
                </div>

                {/* Text - appears after image on mobile */}
                <div className="order-2 md:order-1">
                    <h3 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                        We Take <br /> Custom Order
                    </h3>
                    <p className="text-base sm:text-lg mb-8 max-w-md" style={{ color: "var(--text-secondary)" }}>
                        We will build project for your Major Project and secure your full potential with us and make sure to perfect and I love you
                    </p>
                    <button
                        className="bg-[#5454D4] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#4444c0] transition"
                    >
                        Place Order
                    </button>
                </div>
            </div>

        </section>
    );
};

export default ServicesSection;
