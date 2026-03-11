// NavigationStyles.js

/* ---------------------------------------------------
   VARIABLES DE COLOR PARA AMBOS TEMAS
--------------------------------------------------- */
const light = {
    bg: "bg-white",
    text: "text-black",
    textSoft: "text-black/70",
    border: "border-black/10",
    hover: "hover:bg-black/5",
};

const dark = {
    bg: "bg-black",
    text: "text-white",
    textSoft: "text-white/70",
    border: "border-white/10",
    hover: "hover:bg-white/10",
};

/* ---------------------------------------------------
   USO AUTOMÁTICO SEGÚN TEMA
--------------------------------------------------- */
const theme = (lightClass, darkClass) =>
    `[data-theme='light']:${lightClass} [data-theme='dark']:${darkClass}`;

/* ---------------------------------------------------
   BASE NAV STYLES (DINÁMICOS)
--------------------------------------------------- */
export const navStyles = {
    wrapper: `
        w-full backdrop-blur-sm border-b
        ${theme(light.bg, dark.bg)}
        ${theme(light.border, dark.border)}
    `,

    inner: "max-w-7xl mx-auto flex items-center justify-between py-3 px-6",

    dropdownButton: `
        flex items-center gap-2 px-4 py-2 rounded-xl font-medium
        transition-all duration-300 active:scale-95
        ${theme("text-black", "text-white")}
        ${theme("hover:bg-black/5", "hover:bg-white/10")}
    `,

    dropdownMenu: `
        absolute mt-2 left-0 w-64 rounded-xl shadow-xl p-2 z-50 animate-fadeIn border
        ${theme(light.bg, dark.bg)}
        ${theme(light.border, dark.border)}
    `,

    categoryGroup: `
        p-2 rounded-lg transition-colors
        ${theme(light.hover, dark.hover)}
    `,

    mainCategoryLink: `
        flex items-center justify-between font-semibold
        transition-colors
        ${theme("text-black", "text-white")}
        ${theme("hover:text-blue-600", "hover:text-blue-300")}
    `,

    subcategoryList: "pl-3 mt-2 flex flex-col gap-1",

    subCategoryLink: `
        transition-colors text-sm
        ${theme("text-black/70", "text-white/80")}
        ${theme("hover:text-blue-600", "hover:text-blue-300")}
    `,

    navHorizontal: `
        flex items-center gap-6
        ${theme("text-black", "text-white")}
    `,

    navLinkSpecial: `
        font-semibold transition-colors
        ${theme("text-black", "text-white")}
        ${theme("hover:text-blue-600", "hover:text-blue-300")}
    `,

    /* MOBILE */
    mobileWrapper: `
        flex flex-col gap-2
        ${theme("text-black", "text-white")}
    `,

    mobileLink: `
        flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${theme("text-black", "text-white")}
        ${theme("hover:bg-black/5", "hover:bg-white/10")}
    `,

    mobileLinkSpecial: `
        flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition-colors
        ${theme("bg-black/5", "bg-white/10")}
        ${theme("text-black", "text-white")}
        ${theme("hover:bg-black/10", "hover:bg-white/20")}
    `,
};

/* ---------------------------------------------------
CONTRAST FIX (NO SE TOCA)
--------------------------------------------------- */
export const navContrastFix = {
    allWhite: () =>
        "text-white [&_*]:text-white [&_*]:fill-white",

    dropdownStrong: () =>
        "bg-black border-white/20 shadow-2xl text-white [&_*]:text-white [&_*]:fill-white",

    dropdownButtonFix: () =>
        "text-white [&>span]:text-white",

    navHorizontalFix: () =>
        "text-white [&>a]:text-white",

    mobileWrapperFix: () =>
        "text-white [&_*]:text-white",
};
