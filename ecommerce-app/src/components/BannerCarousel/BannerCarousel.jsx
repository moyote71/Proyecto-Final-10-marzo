import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./BannerCarouselStyles";
import Button from "../common/Button";
import Icon from "../common/Icon/Icon";

export default function BannerCarousel({ banners = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-cambio cada 5 segundos
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const goToSlide = (index) => {
        if (isTransitioning || index === currentIndex) return;

        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const goToPrevious = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentIndex(
            currentIndex === 0 ? banners.length - 1 : currentIndex - 1
        );
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const goToNext = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentIndex(
            currentIndex === banners.length - 1 ? 0 : currentIndex + 1
        );
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const handleKeyDown = (e, action) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            action();
        }
    };

    if (!banners.length) {
        return (
            <div className="w-full flex items-center justify-center h-60 bg-gray-100 rounded-xl">
                <div className="text-center text-gray-500">
                    <Icon name="image" size={48} />
                    <h3 className="text-lg font-semibold mt-2">No hay banners disponibles</h3>
                    <p className="text-sm">Los banners aparecerán aquí cuando estén disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden rounded-xl">
            {/* Slides */}
            <div className="relative h-[420px] w-full">
                {banners.map((banner, index) => {
                    const isActive = index === currentIndex;

                    return (
                        <div
                            key={banner.id || index}
                            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 
                             ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}`}
                            style={{
                                backgroundImage: `url(${banner.image})`,
                                backgroundColor: banner.backgroundColor,
                            }}
                            aria-hidden={!isActive}
                        >
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40"></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center justify-start px-10">
                                <div className="max-w-xl text-white space-y-4">
                                    <h1 className="text-4xl font-bold drop-shadow-md">
                                        {banner.title}
                                    </h1>
                                    <p className="text-lg opacity-90">{banner.subtitle}</p>

                                    <div className="flex gap-4 mt-4">
                                        <Button
                                            variant="primary"
                                            size="large"
                                            onClick={() => console.log("Navegar:", banner.buttonLink)}
                                            aria-label={`${banner.buttonText} - ${banner.title}`}
                                        >
                                            {banner.buttonText}
                                        </Button>

                                        {banner.secondaryButton && (
                                            <Button
                                                variant="secondary"
                                                size="large"
                                                onClick={() => console.log("Acción secundaria:", banner.title)}
                                            >
                                                {banner.secondaryButton}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Controls */}
            {banners.length > 1 && (
                <>
                    <button
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
                        onClick={goToPrevious}
                        onKeyDown={(e) => handleKeyDown(e, goToPrevious)}
                        aria-label="Banner anterior"
                    >
                        <Icon name="chevronLeft" size={24} />
                    </button>

                    <button
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
                        onClick={goToNext}
                        onKeyDown={(e) => handleKeyDown(e, goToNext)}
                        aria-label="Banner siguiente"
                    >
                        <Icon name="chevronRight" size={24} />
                    </button>
                </>
            )}

            {/* Indicators */}
            {banners.length > 1 && (
                <div className="absolute bottom-5 w-full flex justify-center gap-3">
                    {banners.map((banner, index) => (
                        <button
                            key={banner.id || index}
                            className={`w-3 h-3 rounded-full transition 
                ${index === currentIndex ? "bg-white" : "bg-white/40"}`}
                            onClick={() => goToSlide(index)}
                            onKeyDown={(e) => handleKeyDown(e, () => goToSlide(index))}
                        />
                    ))}
                </div>
            )}

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                <div
                    className="h-full bg-white transition-all duration-500"
                    style={{
                        width: `${((currentIndex + 1) / banners.length) * 100}%`,
                    }}
                />
            </div>

            {/* Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1}/{banners.length}
            </div>
        </div>
    );
}

BannerCarousel.propTypes = {
    banners: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            title: PropTypes.string.isRequired,
            subtitle: PropTypes.string,
            image: PropTypes.string.isRequired,
            buttonText: PropTypes.string,
            buttonLink: PropTypes.string,
            secondaryButton: PropTypes.string,
            backgroundColor: PropTypes.string,
        })
    ),
};

BannerCarousel.defaultProps = {
    banners: [],
};
