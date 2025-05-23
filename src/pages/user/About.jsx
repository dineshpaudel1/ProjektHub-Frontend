import React from 'react';
import aboutPhoto from '../../assets/images/aboutphoto.png';
import { FaGraduationCap } from 'react-icons/fa';
import { BsWhatsapp } from 'react-icons/bs';

const About = () => {
    const points = [
        "We give you full optimized project Place the order",
        "We give you full optimized project Place the order",
        "We give you full optimized project Place the order",
        "We give you full optimized project Place the order",
    ];

    return (
        <section
            id='about'
            className="w-full px-4 sm:px-6 lg:px-16 py-20 sm:py-24 relative z-0"
            style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
        >
            {/* Section Title */}
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold inline-block relative pb-2">
                    About Us
                    <span className="absolute left-1/2 -bottom-1 w-24 h-1 bg-[#5454D4] rounded-full -translate-x-1/2"></span>
                </h2>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
                {/* Text Column */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug">
                        We Make Your Ideas <br className="hidden md:block" /> in Reality World
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto md:mx-0" style={{ color: 'var(--text-secondary)' }}>
                        We will build project for your Major Project and secure your full potential with us and make sure to perfect and I love you.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 justify-items-center md:justify-items-start">
                        {points.map((point, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <FaGraduationCap className="text-blue-500 text-xl" />
                                <span className="text-sm sm:text-base">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Column */}
                <div className="flex-1 flex justify-center items-center relative w-full pt-8 md:pt-0">
                    {/* WhatsApp Badge */}
                    <div
                        className="absolute top-2 left-1/2 transform -translate-x-1/2 sm:top-4 sm:translate-x-0 shadow-xl rounded-full px-4 py-2 flex items-center gap-2 z-10"
                        style={{
                            backgroundColor: 'var(--hover-bg)',
                            border: '1px solid var(--border-color)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <BsWhatsapp className="text-green-500 text-xl" />
                        <span className="text-sm font-semibold leading-tight text-center sm:text-left" style={{ color: 'var(--text-color)' }}>
                            Contact us anytime<br />9847503434
                        </span>
                    </div>

                    {/* Image */}
                    <img
                        src={aboutPhoto}
                        alt="About us"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md relative z-0"
                    />
                </div>
            </div>
        </section>
    );
};

export default About;
