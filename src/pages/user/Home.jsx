import React from "react";
import person from "../../assets/images/person.png"; // use your image path

const Home = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-[#19191B] overflow-hidden">
            {/* Left Gradient Blur */}
            <div className="absolute top-[600px] left-0 w-[90%] h-[20%]">
                <div className="w-full h-full blur-[350px]"
                    style={{
                        background: "linear-gradient(to bottom, #5454D4 20%, #5454D4 10%)"
                    }}
                />
            </div>

            {/* Right Gradient Blur */}
            <div className="absolute top-[600px] right-20 w-[90%] h-[5%]">
                <div className="w-full h-full blur-[350px]"
                    style={{
                        background: "linear-gradient(to bottom, #FF4500 10%, #B043FF 10%)"
                    }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="text-white">
                    <h1 className="text-5xl font-extrabold leading-tight mb-6">
                        Get <span className="text-[#5454D4]">Awesome</span><br /> Project
                    </h1>
                    <p className="text-lg text-gray-300 mb-8">
                        We will build project for your Major Project and secure your full potential with us and make sure to perfect and I love you
                    </p>
                    <button className="bg-[#5454D4] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#4444c0] transition">
                        Explore
                    </button>
                </div>

                {/* Image */}
                <div className="flex justify-center">
                    <img src={person} alt="Illustration" className="w-[90%] max-w-md" />
                </div>
            </div>
        </section>
    );
};

export default Home;
