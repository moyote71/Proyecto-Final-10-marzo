import { cva } from "class-variance-authority";

const OrderConfirmationStyles = {
    container: cva(
        "min-h-screen bg-gray-50 flex justify-center items-center px-4 py-12"
    ),

    card: cva(
        "bg-white shadow-lg rounded-2xl max-w-2xl w-full p-8 flex flex-col gap-6"
    ),

    iconBox: cva("flex justify-center"),

    title: cva("text-3xl font-bold text-center text-gray-800"),

    message: cva("text-center text-gray-600"),

    details: cva("bg-gray-100 border border-gray-200 rounded-xl p-6 mt-4"),

    subtitle: cva("text-xl font-semibold mb-4"),

    orderBox: cva("flex flex-col gap-4 text-gray-700"),

    itemsList: cva("divide-y divide-gray-200 mt-2"),

    item: cva("flex justify-between py-2 text-sm"),

    totals: cva("mt-4 space-y-2"),

    actions: cva("flex gap-4 justify-center mt-6"),

    primaryBtn: cva(
        "flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
    ),

    secondaryBtn: cva(
        "flex items-center gap-2 bg-gray-200 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-300 transition"
    ),
};

export default OrderConfirmationStyles;
