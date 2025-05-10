import React from 'react';
import aboutPhoto from '../../assets/images/aboutphoto.png';
import { FaGraduationCap } from 'react-icons/fa';
import { BsWhatsapp } from 'react-icons/bs';

const About = () => {
    const points = [
        "We give you full optimized project",
        "We give you full optimized project",
        "We give you full optimized project",
        "We give you full optimized project",
    ];

    return (
        <section id='about'
            className="w-full px-6 py-16"
            style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
        >
            {/* Section Title */}
            <div className="flex justify-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold border-b-4 border-[#5454D4] pb-1">
                    Services
                </h2>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">

                {/* Text Column */}
                <div className="flex-1 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        We Make Your Ideas in Reality World
                    </h2>
                    <p className="text-base leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                        We will build project for your Major Project and secure your full potential with us and make sure to perfect and I love you.
                        We will build project for your Major Project and secure your full potential with us.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {points.map((point, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <FaGraduationCap className="text-blue-500 text-xl" />
                                <span className="text-sm">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Column with Overlapping WhatsApp Badge */}
                <div className="flex-1 flex flex-col items-center relative">
                    {/* About Us Heading */}


                    {/* Overlapping WhatsApp badge */}
                    <div
                        className="absolute -left-6 top-2 sm:-left-10 sm:top-4 shadow-xl rounded-full px-4 py-2 flex items-center gap-2 z-10 mt-10 ml-10"
                        style={{
                            backgroundColor: 'var(--hover-bg)',
                            border: '1px solid var(--border-color)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <BsWhatsapp className="text-green-500 text-xl" />
                        <span
                            className="text-sm font-semibold leading-tight"
                            style={{ color: 'var(--text-color)' }}
                        >
                            Contact us anytime<br />9847503434
                        </span>
                    </div>

                    {/* Image */}
                    <img
                        src={aboutPhoto}
                        alt="About us"
                        className="w-full max-w-md relative z-0"
                    />
                </div>
            </div>
        </section>
    );
};

export default About;
