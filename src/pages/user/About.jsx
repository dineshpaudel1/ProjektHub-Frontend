import React from "react";
import aboutPhoto from "../../assets/images/about.png";

const About = () => {
    return (
        <section
            id="about"
            className="w-full px-4 sm:px-6 lg:px-16 py-20 sm:py-24"
            style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                fontFamily: "var(--font-primary)",
            }}
        >
            {/* Heading */}
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold">
                    About <span className="text-[var(--button-primary)]">Us</span>
                </h2>
                <div className="h-1 w-24 mx-auto mt-2 bg-[#5454D4] rounded-full"></div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
                {/* Left: Text */}
                <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                        We Make <br />
                        <span className="relative inline-block">
                            <span className="z-10 relative">Your Ideas</span>
                            <span className="absolute inset-0 -bottom-3 h-2 bg-blue-200 z-0 rounded-full w-[90%]"></span>
                        </span>{" "}
                        Into{" "}
                        <span className="text-[var(--button-primary)]">Reality World</span>.
                    </h2>
                    <p
                        className="text-base sm:text-lg mb-8 max-w-xl mx-auto lg:mx-0"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        We use creativity and code to help students and businesses bring their ideas to life. From final year
                        projects to scalable platforms, we tailor each solution with precision and care.
                    </p>
                    <button className="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white px-6 py-3 rounded-full font-semibold text-sm transition">
                        Let's Build With Us
                    </button>
                </div>

                {/* Right: Image */}
                <div className="flex-1 relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
                    <div className="absolute -top-10 -left-10 w-full h-full z-0">
                        <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"></svg>
                    </div>
                    <img
                        src={aboutPhoto}
                        alt="Working on project"
                        className="relative z-10 w-full rounded-xl object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default About;
