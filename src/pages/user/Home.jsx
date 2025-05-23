import React from "react";
import person from "../../assets/images/person.png";

const Home = () => {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: "var(--bg-color)" }}
        >
            {/* Left Blur */}
            <div className="absolute top-[600px] left-0 w-[90%] h-[20%]">
                <div
                    className="w-full h-full blur-[200px] sm:blur-[300px] md:blur-[350px]"
                    style={{ backgroundColor: "var(--blur-bg)" }}
                />
            </div>

            {/* Right Blur */}
            <div className="absolute top-[600px] right-4 sm:right-20 w-[90%] h-[5%]">
                <div
                    className="w-full h-full blur-[200px] sm:blur-[300px] md:blur-[350px]"
                    style={{ backgroundColor: "var(--blur-bg)" }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 flex flex-col-reverse md:grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
                {/* Text Content */}
                <div>
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6"
                        style={{ color: "var(--text-color)" }}
                    >
                        Get <span className="text-[#5454D4]">Awesome</span>
                        <br /> Project
                    </h1>
                    <p
                        className="text-base sm:text-lg mb-8"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        We will build project for your Major Project and secure your full
                        potential with us and make sure to perfect and I love you
                    </p>
                    <button className="bg-[#5454D4] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#4444c0] transition">
                        Explore
                    </button>
                </div>

                {/* Image */}
                <div className="flex justify-center">
                    <img
                        src={person}
                        alt="Illustration"
                        className="w-[80%] sm:w-[70%] md:w-[90%] max-w-md"
                    />
                </div>
            </div>
        </section>
    );
};

export default Home;
