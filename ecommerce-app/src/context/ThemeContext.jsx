import React, { createContext, useContext, useEffect, useState } from "react";
import { cva } from "class-variance-authority";

// Variantes globales de theme en un solo punto
export const themeVariants = cva("", {
    variants: {
        mode: {
            light: "bg-gray-100 text-gray-900",
            dark: "bg-gray-900 text-gray-100",
        },
    },
    defaultVariants: {
        mode: "light",
    },
});

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    const toggleTheme = () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light"));

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.className = themeVariants({ mode: theme });
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
