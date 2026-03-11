import { cva } from "class-variance-authority";

export const checkoutContainer = cva(
    "w-full flex flex-col md:flex-row gap-8 px-4 md:px-8 py-10 max-w-7xl mx-auto"
);

export const checkoutLeft = cva(
    "flex-1 flex flex-col gap-8"
);

export const checkoutRight = cva(
    "w-full md:w-1/3 bg-white rounded-xl shadow-md p-6 h-fit sticky top-4"
);

export const summaryBox = cva(
    "bg-gray-50 border border-gray-200 p-6 rounded-xl"
);
