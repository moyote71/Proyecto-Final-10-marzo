import { cva } from "class-variance-authority";

/* Contenedor principal */
export const loginContainer = cva(
    "min-h-screen flex items-center justify-center bg-gray-100 p-4"
);

/* Tarjeta central */
export const loginCard = cva(
    "w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4"
);

/* Sección de demo users */
export const demoUsers = cva(
    "bg-gray-50 border border-gray-200 rounded-md p-3 space-y-1 text-sm"
);

/* Formulario */
export const loginForm = cva(
    "flex flex-col gap-4 mt-4"
);

/* Footer */
export const loginFooter = cva(
    "mt-4 text-center text-sm"
);
