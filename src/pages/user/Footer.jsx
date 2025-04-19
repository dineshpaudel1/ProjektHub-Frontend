import React from 'react';
import { FaFacebookF, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer
            className="border-t transition-all"
            style={{
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
                borderColor: 'var(--border-color)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

                {/* Explore */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Explore</h3>
                    <ul className="space-y-2 text-[var(--text-secondary)]">
                        <li><a href="#" className="hover:underline">Projects</a></li>
                        <li><a href="#" className="hover:underline">Reports</a></li>
                        <li><a href="#" className="hover:underline">Assignment</a></li>
                    </ul>
                </div>

                {/* Communities */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Communities</h3>
                    <ul className="space-y-2 text-[var(--text-secondary)]">
                        <li><a href="#" className="hover:underline">For Developers</a></li>
                        <li><a href="#" className="hover:underline">For Clients</a></li>
                        <li><a href="#" className="hover:underline">For Students</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Company</h3>
                    <p className="mb-4 text-[var(--text-secondary)]">Projecthub</p>

                    <h4 className="text-lg font-semibold mb-2">Follow us on</h4>
                    <div className="flex space-x-4">
                        {[
                            { icon: <FaFacebookF />, link: '#' },
                            { icon: <FaYoutube />, link: '#' },
                            { icon: <FaInstagram />, link: '#' },
                        ].map(({ icon, link }, i) => (
                            <a
                                key={i}
                                href={link}
                                className="p-2 rounded-full transition-transform hover:scale-110"
                                style={{
                                    backgroundColor: 'var(--button-primary)',
                                    color: 'white',
                                }}
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="text-center text-sm py-4"
                style={{
                    color: 'var(--text-secondary)',
                    borderTop: '1px solid var(--border-color)',
                }}
            >
                © All Right Reserved 2025
            </div>
        </footer>
    );
};

export default Footer;
