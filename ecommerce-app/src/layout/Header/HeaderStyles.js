import { cva } from "class-variance-authority";

export const headerStyles = {
    /* --------------------------- ROOT --------------------------- */
    root: cva(
        "w-full sticky top-0 z-[200] bg-[#000000]/95 backdrop-blur-2xl border-b border-[#1a1a1a]"
    ),

    main: cva("w-full"),
    container: cva("max-w-7xl mx-auto px-4 lg:px-6"),
    content: cva("flex items-center justify-between h-16 text-white"),

    /* --------------------------- LOGO --------------------------- */
    logo: cva("text-xl font-bold tracking-tight text-white select-none"),
    logoExtension: cva("text-blue-500"),

    /* --------------------------- SEARCH --------------------------- */
    searchForm: cva(
        "relative flex items-center rounded-xl bg-[#0a0a0a] border border-[#222] shadow-inner"
    ),

    searchInput: cva(
        "w-64 px-3 py-1.5 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
    ),

    searchBtn: cva(
        "p-2 hover:bg-[#111] transition rounded-r-xl text-white"
    ),

    /* Desktop-only wrapper */
    searchContainer: cva("hidden lg:block"),

    /* ----------------------- ICON BUTTONS ----------------------- */
    iconBtn: cva("p-2 rounded-md hover:bg-[#111] transition text-white"),
    cartBtn: cva("relative p-2 rounded-md hover:bg-[#111] transition text-white"),
    cartBadge: cva(
        "absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
    ),
    themeBtn: cva("p-2 rounded-lg hover:bg-[#111] transition text-white"),

    /* ------------------------- MOBILE ONLY ------------------------- */
    mobileOnly: (extra = "") => `lg:hidden ${extra}`,
    desktopOnly: (extra = "") => `hidden lg:block ${extra}`,

    /* ----------------------- USER BUTTON --------------------------- */
    userInfo: cva(
        "flex items-center px-2 py-1.5 rounded-xl border border-transparent hover:border-[#333] transition cursor-pointer",
        {
            variants: {
                active: {
                    true: "bg-[#0a0a0a] border-[#333]"
                }
            }
        }
    ),

    userAvatar: cva(
        "w-8 h-8 rounded-full bg-[#111] text-white border border-[#333] flex justify-center items-center text-xs font-bold"
    ),

    userAvatarLarge: cva(
        "w-12 h-12 rounded-full bg-[#111] text-white border border-[#333] flex justify-center items-center text-base font-bold"
    ),

    userTextWrapper: cva("flex flex-col text-left ml-2"),
    greeting: cva("text-xs text-gray-300"),
    accountText: cva("text-sm font-medium"),
    userMenuWrapper: cva("relative"),

    userDropdown: cva(
        "absolute right-0 mt-3 w-56 rounded-2xl bg-[#24262b]/95 text-white border border-white/15 shadow-2xl backdrop-blur-2xl py-3 origin-top z-[120] animate-dropdown-island"
    ),

    dropdownItem: cva(
        "flex items-center gap-3 px-4 py-2 text-white/95 hover:bg-white/10 hover:text-white transition rounded-lg"
    ),

    /* ---------------- AUTH DESKTOP ---------------- */
    authHeader: cva("flex items-center gap-3 px-4 py-3 border-b border-white/10"),
    authBtnPrimary: cva(
        "w-full flex items-center justify-center gap-3 mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    ),
    authBtnSecondary: cva(
        "w-full flex items-center justify-center gap-3 mt-2 px-4 py-2 bg-[#111] text-white rounded-lg hover:bg-[#222] transition"
    ),

    /* ---------------- USER PROFILE SECTION ---------------- */
    userSection: cva("px-4 pb-3"),
    userProfile: cva("flex items-center gap-3 px-4 pt-2"),
    userName: cva("font-medium"),
    userEmail: cva("text-xs text-gray-400"),

    userLinks: cva("mt-3 flex flex-col gap-1 px-2"),
    userLink: cva(
        "flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg transition text-sm"
    ),

    logoutSection: cva("px-3 mt-3"),
    logoutBtn: cva(
        "w-full flex items-center gap-3 px-4 py-2 bg-red-600/80 hover:bg-red-600 transition rounded-lg justify-center text-white"
    ),

    /* ----------------------- MOBILE SEARCH ----------------------- */
    mobileSearchOverlay: cva(
        "fixed inset-0 bg-black/70 backdrop-blur-xl z-[300] flex pt-10"
    ),

    mobileSearchContainer: cva("w-full px-4"),
    mobileSearchForm: cva(
        "flex items-center gap-3 bg-[#0a0a0a] border border-[#222] rounded-xl px-3 py-2"
    ),
    mobileSearchBack: cva("p-2 rounded-lg hover:bg-[#111] transition text-white"),
    mobileSearchInput: cva(
        "w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
    ),
    mobileSearchBtn: cva("p-2 rounded-lg hover:bg-[#111] transition text-white"),

    /* ------------------------ MOBILE MENU ------------------------ */
    mobileMenuOverlay: cva(
        "fixed inset-0 bg-black/80 backdrop-blur-xl z-[250]"
    ),

    mobileMenuContent: cva(
        "w-72 bg-[#0a0a0a] h-full p-5 overflow-y-auto shadow-2xl border-r border-[#1a1a1a] text-white"
    ),

    mobileMenuHeader: cva(
        "flex justify-between items-center mb-5"
    ),
    mobileMenuLogo: cva("text-xl font-bold"),
    mobileMenuClose: cva("p-2 rounded-lg hover:bg-[#111] transition"),

    mobileUserSection: cva("mb-6"),

    mobileAuthHeader: cva("flex items-center gap-3 mb-3"),
    mobileAuthButtons: cva("flex flex-col gap-3"),
    mobileAuthBtnPrimary: cva(
        "flex items-center gap-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
    ),
    mobileAuthBtnSecondary: cva(
        "flex items-center gap-3 px-4 py-2 bg-[#111] rounded-lg hover:bg-[#222] transition"
    ),

    mobileUserInfo: cva("flex items-center gap-3"),
    mobileUserAvatar: cva(
        "w-12 h-12 rounded-full bg-[#111] border border-[#333] flex justify-center items-center text-white font-bold text-base"
    ),
    mobileUserName: cva("text-base font-medium"),
    mobileUserEmail: cva("text-xs text-gray-400"),

    mobileCategoriesNav: cva("mt-6"),
    mobileMainNav: cva("mt-6"),
    mobileSupportNav: cva("mt-6"),

    mobileNavTitle: cva("text-sm font-semibold mb-3 text-gray-300"),
    mobileNavLink: cva(
        "flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#111] transition text-sm"
    ),

    mobileLogoutSection: cva("mt-6"),
    mobileLogoutBtn: cva(
        "w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition justify-center text-white"
    ),
};

/* ---------------- FIX: LEGIBILIDAD UNIVERSAL ---------------- */
export const headerContrastFix = {
    readableText: () => "text-white [&_*]:text-white",
    userMenu: () =>
        "text-white bg-neutral-900/95 backdrop-blur-xl shadow-xl rounded-2xl px-4 py-3 [&_*]:text-white",
    mobileMenu: () =>
        "text-white bg-neutral-900/95 backdrop-blur-xl shadow-2xl rounded-2xl p-4 [&_*]:text-white",
    greeting: () => "text-white font-semibold tracking-wide",
    forceWhite: () => "[&_*]:text-white",
};
