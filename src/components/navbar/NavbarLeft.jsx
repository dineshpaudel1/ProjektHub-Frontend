import React from "react";
import { Menu } from "lucide-react";
import logowhite from "../../assets/images/logowhite.png";
import logoDark from "../../assets/images/logoblack.png";

const NavbarLeft = ({ currentTheme, setMobileMenuOpen, navigate }) => (
    <div className="flex items-center gap-3">
        {/* burger */}
        <button
            className="md:hidden -ml-1"
            onClick={() => setMobileMenuOpen(true)}
            style={{ color: "var(--text-color)" }}
            aria-label="Open menu"
        >
            <Menu size={22} />
        </button>
        {/* logo */}
        <img
            src={currentTheme === "dark" ? logowhite : logoDark}
            alt="Logo"
            className="h-7 sm:h-8 w-auto cursor-pointer"
            onClick={() => navigate("/")}
        />
    </div>
);

export default NavbarLeft;
