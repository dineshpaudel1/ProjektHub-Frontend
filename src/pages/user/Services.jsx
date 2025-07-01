import React, { useState, useEffect } from "react";
import { FaClock, FaLeaf, FaUsers, FaRobot } from "react-icons/fa";
import CustomOrderModal from "../../modals/CustomOrderModal";
import { useNavigate, useLocation } from "react-router-dom";

const services = [
    {
        title: "Project Development",
        desc: "Tailored to build your ideas by project.",
        icon: <FaClock size={24} className="text-white" />,
        color: "bg-[#5454D4]",
    },
    {
        title: "Software Development",
        desc: "Tailored to build scalable Software",
        icon: <FaLeaf size={24} className="text-white" />,
        color: "bg-green-500",
    },
    {
        title: "AI/Ml",
        desc: "To build your AI Projects",
        icon: <FaRobot size={24} className="text-white" />,
        color: "bg-orange-500",
    },
    {
        title: "Client Support",
        desc: "We help you to grow your business.",
        icon: <FaUsers size={24} className="text-white" />,
        color: "bg-indigo-400",
    },
];

const Services = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (localStorage.getItem("openCustomOrderModal") === "true") {
            setIsModalOpen(true);                       // ✅ Open modal
            localStorage.removeItem("openCustomOrderModal"); // 🧹 Clean up
        }
    }, []);


    useEffect(() => {
        if (location.state?.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]);

    const handleCustomOrderClick = () => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsModalOpen(true);
        } else {
            localStorage.setItem("redirectAfterLogin", "/");
            localStorage.setItem("scrollTo", "services");
            localStorage.setItem("openCustomOrderModal", "true");
            navigate("/login", { state: { from: "/" } });
        }
    };
    return (
        <section id="services"
            className="py-30 px-4 sm:px-6 lg:px-16 transition-all"
            style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                fontFamily: "var(--font-primary)",
            }}
        >
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Our <span className="text-[var(--button-primary)]">Services</span>
                </h2>
                <div className="h-1 w-24 mx-auto mt-2 mb-6 bg-[#5454D4] rounded-full"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="rounded-2xl p-6 shadow hover:shadow-md transition-all text-left"
                            style={{
                                backgroundColor: "var(--menu-bg)",
                                borderColor: "var(--border-color)",
                                borderWidth: 1,
                            }}
                        >
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-4 ${service.color}`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                            <p
                                className="text-sm mb-4 truncate"
                                style={{
                                    color: "var(--text-secondary)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {service.desc}
                            </p>

                            <a
                                className="font-semibold text-sm hover:underline inline-flex items-center gap-1"
                                style={{ color: "var(--button-primary)" }}
                                onClick={handleCustomOrderClick}
                            >
                                Click here to develop →
                            </a>
                        </div>
                    ))}
                </div>

                <button
                    className="px-6 py-3 text-sm font-semibold transition rounded-xl"
                    style={{
                        backgroundColor: "var(--button-primary)",
                        color: "#fff",
                    }}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--button-primary-hover)")
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--button-primary)")
                    }
                    onClick={handleCustomOrderClick}
                >
                    Click here to Make Order →
                </button>
                <CustomOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </section>
    );
};

export default Services;
