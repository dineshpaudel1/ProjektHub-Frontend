import React, { useEffect, useState } from "react";
import white from "../../assets/images/servicewhite.png";
import dark from "../../assets/images/servicedark.png";

const ServicesSection = () => {
    const [themeImage, setThemeImage] = useState(white);

    useEffect(() => {
        const updateImage = () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            setThemeImage(currentTheme === "dark" ? dark : white);
        };

        // Initial check
        updateImage();

        // Observe theme changes if done dynamically
        const observer = new MutationObserver(updateImage);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        return () => observer.disconnect();
    }, []);

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
                    <p
                        className="text-base sm:text-lg dark:text-gray-300 mb-6 max-w-md"
                        style={{ color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#d1d5db' : '#000000' }}
                    >
                        We will build project for your Major Project and secure your full
                        potential with us and make sure to perfect and i love you
                    </p>



                    <button
                        className="px-6 py-3 font-semibold text-white rounded-md transition"
                        style={{ backgroundColor: "var(--button-primary)" }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "var(--button-primary-hover)")}
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "var(--button-primary)")}
                    >
                        Place Order
                    </button>
                </div>

                {/* RIGHT: Dynamic Image */}
                <div className="flex justify-center md:justify-end">
                    <img
                        src={themeImage}
                        alt="Services Visual"
                        className="w-[800px] h-[500px] object-contain"
                    />
                </div>

            </div>
        </section>
    );
};

export default ServicesSection;
