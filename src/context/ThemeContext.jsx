// import React, { createContext, useContext, useEffect, useState } from "react";

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//     const getInitialTheme = () =>
//         localStorage.getItem("theme") ||
//         (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

//     const [theme, setTheme] = useState(getInitialTheme);

//     useEffect(() => {
//         document.documentElement.setAttribute("data-theme", theme);
//         localStorage.setItem("theme", theme);
//     }, [theme]);

//     const toggleTheme = () => {
//         setTheme(prev => (prev === "dark" ? "light" : "dark"));
//     };

//     return (
//         <ThemeContext.Provider value={{ theme, toggleTheme }}>
//             {children}
//         </ThemeContext.Provider>
//     );
// };

// export const useThemeContext = () => useContext(ThemeContext);
