import { cva } from "class-variance-authority";

/* Página general del producto */
export const page = cva(
    "max-w-6xl mx-auto p-6 flex flex-col gap-6 animate-fadeIn"
);

/* Mensaje de ID inválido */
export const invalidId = cva(
    "p-8 text-center text-red-600 font-medium bg-red-50 rounded-lg border border-red-200 mx-auto mt-10 max-w-lg"
);
