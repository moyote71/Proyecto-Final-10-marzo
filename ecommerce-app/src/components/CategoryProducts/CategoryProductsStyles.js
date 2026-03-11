export const categoryProductsStyles = {
    root: `
        w-full 
        max-w-[1400px] 
        mx-auto 
        px-4 
        py-6
    `,

    container: "mt-6",

    header: "mb-8",

    title: `
        text-3xl 
        font-bold 
        text-gray-900 
        tracking-tight
    `,

    muted: `
        text-gray-600 
        text-[1rem] 
        leading-relaxed
    `,

    grid: `
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4     /* 🔥 1/4 del ancho */
        gap-7
    `,

    /* PRODUCT CARD */
    card: `
        bg-white
        rounded-3xl
        shadow-lg
        hover:shadow-xl
        transition-all 
        duration-300 
        overflow-hidden
        flex 
        flex-col
    `,

    imageWrapper: `
        w-full 
        aspect-[4/3]       /* 🔥 Mantiene la imagen perfectamente visible */
        overflow-hidden
        bg-gray-200
    `,

    image: `
        w-full 
        h-full 
        object-cover       /* 🔥 Imagen completa, sin recorte raro */
        transition-transform 
        duration-500
        hover:scale-105
    `,

    content: `
        p-6
        flex 
        flex-col 
        gap-4
    `,

    titleText: `
        text-[1.1rem] 
        font-semibold 
        text-gray-900 
        leading-snug
    `,

    price: `
        text-[1.4rem] 
        font-bold 
        text-blue-600
    `,

    button: `
        mt-2
        bg-blue-600 
        text-white 
        py-3 
        rounded-2xl
        font-semibold
        tracking-wide
        hover:bg-blue-700 
        transition
        text-center
    `,
};
