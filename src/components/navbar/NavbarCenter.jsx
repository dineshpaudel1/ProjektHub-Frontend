// --- NavbarCenter.jsx ---
const NavbarCenter = ({ scrollToSection }) => (
    <ul className="hidden md:flex items-center gap-8 text-sm font-medium ml-[200px]">
        {[
            ["Home", "home"],
            ["Projects", "projects"],
            ["Services", "services"],
            ["About Us", "about"],
        ].map(([label, id]) => (
            <li key={id}>
                {/* ⇣ use helper instead of raw navigate */}
                <button
                    onClick={() => scrollToSection(id)}
                    className="whitespace-nowrap hover:text-blue-600 transition"
                >
                    {label}
                </button>
            </li>
        ))}
    </ul>
);

export default NavbarCenter;
