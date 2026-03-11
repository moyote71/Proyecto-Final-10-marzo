import { cva } from "class-variance-authority";

export const cartStyles = {
    wrapper: cva(
        "container mx-auto px-4 py-10 flex flex-col gap-10 md:flex-row md:items-start"
    ),

    empty: cva(
        "flex flex-col items-center justify-center text-center py-20 gap-4"
    ),

    emptyTitle: cva("text-2xl font-semibold"),
    emptyText: cva("text-gray-600"),

    header: cva(
        "flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
    ),

    headerTitle: cva("flex items-center gap-2 text-3xl font-semibold"),
    headerInfo: cva("flex items-center gap-4"),

    itemsCount: cva("text-gray-600 text-sm"),

    itemsWrapper: cva(
        "flex flex-col lg:flex-row gap-8 w-full"
    ),

    summary: cva(
        "w-full lg:w-1/3 bg-white shadow-md rounded-xl p-6 flex flex-col gap-6 h-fit"
    ),

    totalBox: cva("flex justify-between items-center border-b pb-4"),
    totalLabel: cva("text-gray-600 text-sm"),
    totalAmount: cva("text-2xl font-semibold"),

    actions: cva("pt-2")
};
