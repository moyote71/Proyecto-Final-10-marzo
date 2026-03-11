const carouselStyles = {
  wrapper: "relative w-full overflow-hidden rounded-xl",

  slideContainer: "relative h-[420px] w-full",

  slide:
  `absolute inset-0 bg-cover bg-center 
  transition-all duration-500 ease-in-out`,

  slideActive: "opacity-100 translate-x-0",
  slideInactive: "opacity-0 translate-x-full",

  overlay: "absolute inset-0 bg-black/40",

  contentBox:
    `absolute inset-0 flex items-center justify-start 
    px-10 text-white z-10`,

  title: "text-4xl font-bold drop-shadow-md",
  subtitle: "text-lg opacity-90",

  actions: "flex gap-4 mt-4",

  arrowBase:
    `absolute top-1/2 -translate-y-1/2 
    bg-black/40 hover:bg-black/60 
    text-white p-2 rounded-full transition`,
  arrowLeft: "left-4",
  arrowRight: "right-4",

  indicators: "absolute bottom-5 w-full flex justify-center gap-3",

  indicatorBase: "w-3 h-3 rounded-full transition",
  indicatorActive: "bg-white",
  indicatorInactive: "bg-white/40",

  progressContainer: "absolute bottom-0 left-0 w-full h-1 bg-white/20",
  progressBar: "h-full bg-white transition-all duration-500",

  counter:
    `absolute top-4 right-4 
    bg-black/50 text-white px-3 py-1 
    rounded-full text-sm`,
};

export default carouselStyles;
