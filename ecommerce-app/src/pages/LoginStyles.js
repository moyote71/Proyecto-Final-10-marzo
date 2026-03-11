import { cva } from "class-variance-authority";

const loginStyles = {
    container: cva(
        "min-h-screen w-full flex items-center justify-center bg-gray-50 px-4"
    ),
    card: cva(
        "w-full max-w-md bg-white shadow-md rounded-lg p-6 flex flex-col gap-4"
    ),
};

export default loginStyles;
