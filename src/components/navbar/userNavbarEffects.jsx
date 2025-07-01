import { useEffect, useState } from "react";
import { protectedApi, publicApi } from "../../services/axiosInstance";

const NAV_HEIGHT = 80; // <— same fixed-navbar height (px)

export const useNavbarEffects = ({
    /* routing / context */
    user,
    setUser,
    navigate,
    location,

    /* UI state setters */
    setShowNotif,
    setDropdownOpen,
    setShowMobileSearch,

    /* local booleans */
    mobileMenuOpen,
    showMobileSearch,

    /* refs / theme */
    mobileSearchRef,
    setTheme,
    theme,
    resolvedTheme,
}) => {
    /* ───────── theme helpers ───────── */
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    const toggleDarkMode = () =>
        setTheme(currentTheme === "dark" ? "light" : "dark");

    /* ───────── logout ───────── */
    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/");
    };

    /* ───────── notifications ───────── */
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await protectedApi.get("/notifications?role=USER");
                setNotifications(data.data || []);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [user]);

    /* ───────── body-scroll lock for drawer ───────── */
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    }, [mobileMenuOpen]);

    /* ───────── click-outside close handlers ───────── */
    useEffect(() => {
        const close = (e) => {
            if (!e.target.closest(".profile-dropdown")) setDropdownOpen(false);
            if (!e.target.closest(".notification-dropdown")) setShowNotif(false);
            if (
                showMobileSearch &&
                !e.target.closest("#mobile-search-bar") &&
                !e.target.closest("#mobile-search-toggle")
            ) {
                setShowMobileSearch(false);
            }
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [showMobileSearch]);

    /* ───────── focus mobile search automatically ───────── */
    useEffect(() => {
        if (showMobileSearch) mobileSearchRef.current?.focus();
    }, [showMobileSearch]);

    /* ───────── search box key handler ───────── */
    const handleSearchKey = (e, query, onClose) => {
        if (e.key === "Enter" && query.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(query.trim())}`);
            onClose?.();
        }
        if (e.key === "Escape") onClose?.();
    };

    /* ───────── scroll-to-section helper ───────── */
    const scrollToSection = (id) => {
        const localScroll = () => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                /* offset for fixed navbar */
                window.scrollBy(0, -NAV_HEIGHT);
            }
        };

        if (location.pathname !== "/") {
            // jump home, pass where to scroll
            navigate("/", { state: { scrollTo: id } });
        } else {
            localScroll();
        }
    };

    return {
        notifications,
        loadingNotifications,
        toggleDarkMode,
        handleLogout,
        handleSearchKey,
        scrollToSection,
        currentTheme,
    };
};
