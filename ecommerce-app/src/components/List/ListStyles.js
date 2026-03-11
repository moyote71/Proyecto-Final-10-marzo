import { cva } from "class-variance-authority";

// Contenedor principal
const container = cva("w-full flex flex-col gap-6");

// Header
const header = cva("mb-2");

// Título
const title = cva("text-2xl font-semibold text-gray-800");

// Layout grid o vertical
const layout = cva("", {
    variants: {
        layout: {
            grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
            vertical: "flex flex-col gap-4",
        },
    },
    defaultVariants: {
        layout: "grid",
    },
});

// Cada ítem de la lista
const item = cva("w-full");

export const ListStyles = {
    container,
    header,
    title,
    layout,
    item,
};
