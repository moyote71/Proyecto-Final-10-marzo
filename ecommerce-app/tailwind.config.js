module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    blue: "#26336c",
                    purple: "#8677b5",
                    pink: "#d38fb9",
                    yellow: "#e7e000",
                    green: "#79bf87",
                    sky: "#3eb7ea",
                    red: "#dc2626",
                },

                // ===== GRAYS APPLE STYLE =====
                grayA: {
                    1: "#f7f7f8",   // fondo general
                    2: "#efeff0",   // tarjetas
                    3: "#dcdcdf",   // bordes
                    4: "#9b9ba1",   // texto secundario
                    5: "#6b6b70",   // texto tenue
                },

                // ===== DARK MODE =====
                grayAdark: {
                    1: "#1c1c1e",   // fondo general
                    2: "#2c2c2e",   // tarjetas
                    3: "#3a3a3c",   // bordes
                    4: "#8e8e93",   // texto secundario
                    5: "#aeaeb2",   // texto tenue
                },
            },

            borderRadius: {
                base: "8px",
            },
            boxShadow: {
                card: "0 1px 3px rgba(0,0,0,0.12)",
            },

            keyframes: {
                spinner: {
                    to: { transform: "rotate(360deg)" },
                },
            },
            animation: {
                spinner: "spinner 0.8s linear infinite",
            },
        },
    },
    plugins: [],
};
