import React, { useState } from "react";
import person from "../../assets/images/person.png";
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const [showVideo, setShowVideo] = useState(true);
    const navigate = useNavigate();

    const handleWhatsAppClick = () => {
        const phoneNumber = "9847503434";
        const message = encodeURIComponent("Hello, I’m interested in a project.");
        window.open(`https://wa.me/977${phoneNumber}?text=${message}`, "_blank");
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <div className="max-w-7xl w-full flex flex-col-reverse md:grid md:grid-cols-2 gap-10 items-center">

                {/* Text Section */}
                <div className="text-center md:text-left">
                    <h1
                        className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
                        style={{ color: "var(--text-color)" }}
                    >
                        Manifesting Ideas Into Reality
                    </h1>
                    <p
                        className="text-base sm:text-lg"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Turn your ideas into reality with Project Hub where your unique requirements are transformed into high-quality, custom-built projects designed to meet your goals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-10">
                        {/* Place Order Button */}
                        <button
                            className="min-w-[170px] px-6 py-3 rounded font-semibold transition text-center"
                            style={{
                                backgroundColor: "var(--button-primary)",
                                color: "#ffffff",
                            }}
                            onClick={() => navigate("/services")}
                        >
                            How to Order Project?
                        </button>

                        {/* Explore Projects Button */}
                        <button
                            className="min-w-[170px] border-1  px-6 py-3 rounded font-semibold transition text-center"
                            style={{
                                backgroundColor: "var(--button-bg)",
                                color: "var(--button-text, var(--button-primary))",
                                borderColor: "var(--button-primary)",
                            }}
                            onClick={() => alert("Explore clicked")}
                        >
                            Explore Us
                        </button>
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex justify-center md:justify-end">
                    <img
                        src={person}
                        alt="Illustration"
                        className="w-[80%] max-w-md"
                    />
                </div>
            </div>

            {/* Floating YouTube Video Popup */}

            {/* {showVideo && (
                <div
                    className="fixed z-50 shadow-lg rounded-xl overflow-hidden border"
                    style={{
                        backgroundColor: "var(--bg-color)",
                        border: "1px solid var(--border-color)",
                        width: "50%",
                        maxWidth: "200px",
                        height: "170px",
                        left: "2rem",
                        bottom: window.innerWidth < 640 ? "4.5rem" : "1rem", // Adjust position for small screens
                    }}
                >
                    <div className="relative w-full h-full">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/M5QY2_8704o?start=2915"
                            title="College Projects"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )} */}

            {/* Floating WhatsApp Button */}
            <div className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6">
                <button
                    onClick={handleWhatsAppClick}
                    className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-medium px-4 py-3 rounded-full flex items-center gap-2 shadow-lg"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                    >
                        <path d="M20.52 3.48A11.8 11.8 0 0012 0a11.8 11.8 0 00-8.52 3.48A11.8 11.8 0 000 12c0 2.02.52 3.98 1.52 5.72L0 24l6.28-1.64A11.77 11.77 0 0012 24c6.62 0 12-5.38 12-12a11.8 11.8 0 00-3.48-8.52zM12 21.82c-1.84 0-3.63-.49-5.22-1.4l-.37-.21-3.73.98.99-3.63-.24-.38a9.82 9.82 0 01-1.47-5.17c0-5.44 4.42-9.86 9.86-9.86S21.86 6.56 21.86 12 17.44 21.82 12 21.82z" />
                        <path d="M17.34 14.31l-2.58-.73a.69.69 0 00-.66.17l-.76.78a6.44 6.44 0 01-3.09-3.09l.78-.76a.69.69 0 00.17-.66l-.73-2.58a.71.71 0 00-.66-.48H7.22a.69.69 0 00-.69.69c0 5.16 4.2 9.36 9.36 9.36a.69.69 0 00.69-.69v-2.31a.71.71 0 00-.48-.66z" />
                    </svg>
                    Text Now
                </button>
            </div>

        </section>
    );
};

export default Home;