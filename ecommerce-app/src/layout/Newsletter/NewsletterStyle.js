import { cva } from "class-variance-authority";

export const NewsletterStyle = {
    section: cva("w-full bg-gray-100 py-10"),
    container: cva("max-w-5xl mx-auto px-4"),
    content: cva("flex flex-col lg:flex-row items-center justify-between gap-6"),
    textBox: cva("text-center lg:text-left"),
    title: cva("text-2xl font-bold text-gray-800"),
    description: cva("text-gray-600 mt-1"),
    form: cva("w-full lg:w-auto"),
    inputGroup: cva("flex items-center bg-white rounded-lg overflow-hidden border border-gray-300"),
    input: cva("px-4 py-2 w-full outline-none text-gray-700"),
    button: cva("px-5 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors")
};
