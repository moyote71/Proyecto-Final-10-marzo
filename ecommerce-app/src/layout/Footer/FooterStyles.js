import { cva } from "class-variance-authority";

export const footer = cva(
    "bg-gray-900 text-gray-200 pt-10 border-t border-gray-700"
);

export const container = cva("max-w-7xl mx-auto px-4");

export const main = cva("grid md:grid-cols-4 gap-10 py-10");

export const section = cva("flex flex-col gap-4");

export const logo = cva(
    "text-3xl font-bold text-white hover:text-blue-400 transition"
);

export const description = cva("text-sm text-gray-400 leading-relaxed");

export const socialIcons = cva("flex gap-4 mt-2");

export const link = cva(
    "text-gray-300 hover:text-blue-400 transition text-sm"
);

export const categoryList = cva("flex flex-col gap-2 text-sm");

export const trust = cva("border-t border-gray-700 py-6");

export const trustGrid = cva(
    "grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
);

export const trustItem = cva(
    "flex flex-col items-center gap-2 text-gray-300"
);

export const payment = cva("border-t border-gray-700 py-10");

export const paymentContent = cva(
    "flex flex-col md:flex-row justify-between gap-8"
);

export const paymentIcons = cva("flex gap-4 items-center");

export const contact = cva("flex flex-col gap-2 text-sm text-gray-300");

export const bottom = cva(
    "border-t border-gray-700 py-4 mt-4"
);

export const bottomContent = cva(
    "flex flex-col md:flex-row justify-between items-center gap-4"
);

export const legalLinks = cva("flex flex-wrap justify-center gap-4 text-sm text-gray-400");
