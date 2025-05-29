import React from "react";
import userImg from "../../assets/images/user.png";
import { FaStar } from "react-icons/fa";

const testimonials = [
    {
        name: "Dinesh Paudel",
        role: "CEO",
        photo: userImg,
        text: "Proin iaculis purus consequat sem cure digni ssim donec porttitor entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et.",
    },
    {
        name: "Aniruddha Bishwokarma",
        role: "CEO",
        photo: userImg,
        text: "Export tempor illum tamen malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua.",
    },
];

const Testimonials = () => {
    return (
        <section
            className="py-16 px-4 sm:px-8 lg:px-20 text-center"
            style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
            }}
        >
            <h2 className="text-3xl font-bold mb-4">Testimonials</h2>
            <p className="mb-12 text-[var(--text-secondary)]">
                Project hub have best experience memory with clients
            </p>

            <div className="grid gap-8 md:grid-cols-2">
                {testimonials.map((item, idx) => (
                    <div
                        key={idx}
                        className="p-6 rounded-xl shadow-lg transition-all"
                        style={{
                            backgroundColor: "var(--menu-bg)",
                            border: "1px solid var(--border-color)",
                            color: "var(--text-color)",
                        }}
                    >
                        <div className="flex items-center mb-4">
                            <img
                                src={item.photo}
                                alt="project hub"
                                className="w-16 h-16 rounded-full border-2 border-[var(--border-color)]"
                            />
                            <div className="ml-4">
                                <h4 className="text-lg font-semibold">{item.name}</h4>
                                <p className="flex text-[var(--text-secondary)]">{item.role}</p>
                                <div className="flex text-yellow-400 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-base italic leading-relaxed relative pl-6 text-[var(--text-secondary)]">
                            <span className="absolute left-0 top-0 text-3xl text-blue-300">“</span>
                            {item.text}
                            <span className="text-3xl text-blue-300 ml-1">”</span>
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
