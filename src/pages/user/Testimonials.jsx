import { FaStar, FaQuoteLeft } from "react-icons/fa";
import myphoto from "../../assets/images/user.png";

const testimonials = [
    {
        name: "Dinesh Paudel",
        role: "CEO",
        company: "TechCorp",
        photo: { myphoto },
        text: "Proin iaculis purus consequat sem cure digni ssim donec porttitor entum suscipit rhoncus.",
        rating: 5,
    },
    {
        name: "Aniruddha Bishwokarma",
        role: "CTO",
        company: "InnovateLabs",
        photo: { myphoto },
        text: "Export tempor illum tamen malis eram quae irure esse labore quem cillum quid cillum eram malis.",
        rating: 5,
    },
    {
        name: "Sarah Johnson",
        role: "Product Manager",
        company: "StartupXYZ",
        text: "Outstanding service and exceptional results. The team delivered beyond our expectations.",
        rating: 5,
    },
];

const Testimonials = () => {
    return (
        <section
            className="py-10 px-4 sm:px-8 lg:px-20 transition-colors duration-300"
            style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
            }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                        style={{ backgroundColor: "#c7d2fe" }}>
                        <FaQuoteLeft className="text-blue-600 text-lg" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">What Our Clients Say</h2>
                    <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                        Real feedback from our happy clients.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className="group relative rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border"
                            style={{
                                backgroundColor: "var(--menu-bg)",
                                borderColor: "var(--border-color)"
                            }}
                        >
                            {/* Quote Icon */}
                            <div className="absolute -top-3 left-5">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <FaQuoteLeft className="text-white text-xs" />
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center mb-4 pt-2">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-400 text-sm mr-1" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="text-base leading-relaxed mb-6">
                                "{testimonial.text}"
                            </blockquote>

                            {/* Author Info */}
                            <div className="flex items-center">
                                <div className="relative">
                                    <img
                                        src={myphoto}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                                    />
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-semibold text-base">{testimonial.name}</h4>
                                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{testimonial.role}</p>
                                    <p className="text-blue-600 text-xs">{testimonial.company}</p>
                                </div>
                            </div>

                            {/* Bottom Decorative */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-10">
                    <div className="inline-flex items-center space-x-2">
                        <div className="flex -space-x-2">
                            {testimonials.slice(0, 3).map((testimonial, idx) => (
                                <img
                                    key={idx}
                                    src={myphoto}
                                    alt={testimonial.name}
                                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                            Join 500+ happy clients
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
