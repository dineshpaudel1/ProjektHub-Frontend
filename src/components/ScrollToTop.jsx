import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        document.documentElement.scrollTop = 0; // For most modern browsers
        document.body.scrollTop = 0; // For Safari fallback
    }, [pathname]);

    return null;
};

export default ScrollToTop;
