import { Facebook, Twitter, Instagram, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react"

const Footer = () => {
    return (
        <footer className="relative w-full py-12 px-4 sm:px-6 lg:px-16 overflow-hidden" style={{ backgroundColor: "var(--bg-color)" }}>
            {/* Blur effect similar to home page */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="w-[60%] h-[30%] blur-[200px] sm:blur-[300px] mx-auto" style={{ backgroundColor: "var(--blur-bg)" }} />
            </div>

            <div className="w-full my-8 border-t border-[#5454D4]/30"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Grid layout for sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[var(--text-color)]">Project<span className="text-[#5454D4]">Hub</span></h3>
                        <p className="mb-6 text-[var(--text-secondary)]">
                            We build amazing projects for your major assignments and help you secure your full potential.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin, Github].map((Icon, idx) => (
                                <a key={idx} href="#" className="text-[#5454D4] hover:text-[#4444c0] transition">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[var(--text-color)]">Quick Links</h3>
                        <ul className="text-[var(--text-secondary)] space-y-2">
                            {["Home", "Projects", "Our Services", "About Us"].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="hover:text-[#5454D4] transition">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[var(--text-color)]">Our Services</h3>
                        <ul className="text-[var(--text-secondary)] space-y-2">
                            {["Web Development", "Personal Project Development", "Assignment Task", "Mobile App", "Study Materials"].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="hover:text-[#5454D4] transition">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[var(--text-color)]">Contact Us</h3>
                        <ul className="text-[var(--text-secondary)] space-y-3">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-2 mt-1 text-[#5454D4]" />
                                <span>Gwarko Lalitpur Nepal</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-2 text-[#5454D4]" />
                                <span>9847503434</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-2 text-[#5454D4]" />
                                <span>info@projecthub.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom border & copyright */}
                <div className="w-full my-6 border-t border-[#5454D4]/30"></div>
                <div className="flex flex-col items-center text-center text-[var(--text-secondary)]">
                    <p>© {new Date().getFullYear()} ProjectHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
