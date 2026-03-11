import { cva } from "class-variance-authority";

const container = cva("max-w-5xl mx-auto p-4");

const main = cva(
    "grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 bg-white p-6 rounded-xl shadow"
);

const imageWrapper = cva("w-full flex justify-center");

const image = cva("rounded-lg w-full max-w-md object-cover");

const info = cva("flex flex-col gap-4");

const title = cva("flex flex-col gap-1");

const category = cva("text-sm text-blue-600 font-medium");

const description = cva("text-gray-600 leading-relaxed");

const stock = cva("flex items-center gap-3");

const price = cva("text-3xl font-bold text-strongblue mt-4");

const actions = cva("flex gap-4 mt-6");

const viewCart = cva(
    "px-4 py-2 border border-strongblue text-strongblue rounded-lg hover:bg-strongblue hover:text-white transition"
);

const ProductDetailsStyles = {
    container,
    main,
    imageWrapper,
    image,
    info,
    title,
    category,
    description,
    stock,
    price,
    actions,
    viewCart,
};

export default ProductDetailsStyles;
