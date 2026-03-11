import { cva } from "class-variance-authority";

export const homeWrapper = cva(
    "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10 py-6"
);

export const section = cva("w-full flex flex-col gap-6");

export const listWrapper = cva(
    "mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
);
