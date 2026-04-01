import { cva } from "class-variance-authority";

/* Contenedor principal */
export const registerContainer = cva(
    "min-h-screen flex items-center justify-center bg-gray-100 p-4"
);

/* Tarjeta central */
export const registerCard = cva(
    "w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4"
);

/* Formulario */
export const registerForm = cva(
    "flex flex-col gap-4 mt-4"
);

/* Footer */
export const registerFooter = cva(
    "mt-4 text-center text-sm"
);
