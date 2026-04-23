const ProductCardStyles = {
  card: ({ orientation }) =>
    `rounded-xl p-4 flex shadow-md transition-all duration-300
     bg-white dark:bg-neutral-900
     border border-neutral-200 dark:border-neutral-800
     hover:border-[#14B8A6]/60
     hover:shadow-[0_0_10px_0_rgba(20,184,166,0.25)]
     ${orientation === "horizontal" ? "md:flex-row flex-col gap-4" : "flex-col gap-4"}`,

  image: ({ orientation }) =>
    `object-cover rounded-lg border border-neutral-200 dark:border-neutral-700
     ${orientation === "horizontal" ? "w-40 h-40" : "w-full h-56"}`,

  content: () => "flex flex-col flex-1",

  title: () => "text-lg font-semibold mb-1 text-neutral-900 dark:text-white",

  description: () => "text-sm mb-2 text-neutral-500 dark:text-neutral-400",

  price: () => "text-xl font-bold mb-3 text-[#14B8A6] dark:text-[#2DD4BF]",

  footer: () => "flex items-center justify-between mt-auto",
};

export default ProductCardStyles;