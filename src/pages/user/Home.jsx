import { useEffect } from "react"
import person from "../../assets/images/person.png"
import { useNavigate } from "react-router-dom"
import { FaWhatsapp, FaArrowRight } from "react-icons/fa";

const Home = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const scrollTarget = location.state?.scrollTo || localStorage.getItem("scrollTo")
        if (scrollTarget) {
            const element = document.getElementById(scrollTarget)
            if (element) {
                element.scrollIntoView({ behavior: "smooth" })
            }
            localStorage.removeItem("scrollTo")
        }
    }, [location])

    const handleWhatsAppClick = () => {
        const phoneNumber = "9847503434"
        const message = encodeURIComponent("Hello, I'm interested in a project.")
        window.open(`https://wa.me/977${phoneNumber}?text=${message}`, "_blank")
    }

    const handleSectionClick = (sectionId) => {
        if (location.pathname !== "/") {
            navigate(`/#${sectionId}`)
        } else {
            const el = document.getElementById(sectionId)
            if (el) el.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 overflow-hidden"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-7xl w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Text Section */}
                    <div className="text-center lg:text-left space-y-8">
                        <div
                            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                            style={{
                                backgroundColor: "var(--hover-bg)",
                                color: "var(--button-primary)"
                            }}
                        >
                            <span className="w-2 h-2 rounded-full mr-2 animate-pulse bg-blue-600"></span>
                            Professional Development Services
                        </div>

                        {/* Heading */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-tight break-words max-w-3xl mx-auto lg:mx-0"
                                style={{ color: "var(--text-color)" }}
                            >
                                Manifesting Ideas Into{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    Reality
                                </span>
                            </h1>

                            <p className="text-lg sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                Transform your vision into exceptional digital solutions. We specialize in creating custom-built
                                projects
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <button
                                onClick={() => handleSectionClick("services")}
                                className="group relative px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                style={{
                                    background: "var(--button-primary)",
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.backgroundColor = "var(--button-primary-hover)")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.backgroundColor = "var(--button-primary)")
                                }
                            >
                                <span className="relative z-10">How to Order Project?</span>
                            </button>

                            <button
                                onClick={() => handleSectionClick("projects")}
                                className="group px-8 py-4 font-semibold rounded-xl border-2 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                                style={{
                                    backgroundColor: "var(--bg-color)",
                                    color: "var(--text-secondary)",
                                    borderColor: "var(--border-color)"
                                }}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Explore Our Work
                                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div
                            className="grid grid-cols-3 gap-8 pt-8 border-t"
                            style={{ borderColor: "var(--border-color)" }}
                        >
                            {[
                                { value: "00+", label: "Projects Delivered" },
                                { value: "24/7", label: "Support Available" },
                                { value: "00%", label: "Client Satisfaction" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center lg:text-left">
                                    <div className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-60 animate-bounce animation-delay-1000"></div>
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-200 rounded-full opacity-60 animate-bounce animation-delay-3000"></div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl transform rotate-6 opacity-20"></div>
                            <div className="relative rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500"
                                style={{ backgroundColor: "var(--bg-color)" }}
                            >
                                <img
                                    src={person || "/placeholder.svg"}
                                    alt="Professional Illustration"
                                    className="w-full max-w-md h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* WhatsApp Button */}
            {/* WhatsApp Button */}
            <div className="fixed z-50 bottom-6 right-6">
                <button
                    onClick={handleWhatsAppClick}
                    className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-6 py-4 rounded-full flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                    {/* React Icon */}
                    <FaWhatsapp className="w-6 h-6" />

                    <span className="hidden sm:block">Text now</span>

                    {/* Ping indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
            </div>
            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div
                    className="w-6 h-10 border-2 rounded-full flex justify-center"
                    style={{ borderColor: "var(--text-secondary)" }}
                >
                    <div className="w-1 h-3 rounded-full mt-2 animate-pulse"
                        style={{ backgroundColor: "var(--text-secondary)" }}
                    ></div>
                </div>
            </div>
        </section>

    )
}

export default Home
