import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ImageCarousel = ({ images, autoPlayInterval = 5000, className = "" }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const totalImages = images.length;

    const moveTo = useCallback((index) => {
        setActiveIndex((index + totalImages) % totalImages);
    }, [totalImages]);

    const showPrevious = useCallback(() => moveTo(activeIndex - 1), [activeIndex, moveTo]);
    const showNext = useCallback(() => moveTo(activeIndex + 1), [activeIndex, moveTo]);

    useEffect(() => {
        setActiveIndex(0);
    }, [totalImages]);

    useEffect(() => {
        if (totalImages < 2) return undefined;

        const intervalId = window.setInterval(showNext, autoPlayInterval);
        return () => window.clearInterval(intervalId);
    }, [autoPlayInterval, showNext, totalImages]);

    if (!totalImages) return null;

    const activeImage = images[activeIndex];

    return (
        <div
            className={`group relative aspect-[16/9] overflow-hidden rounded-xl bg-blue-100 ${className}`}
            aria-roledescription="carousel"
            aria-label="Thư viện hình ảnh khóa học"
        >
            <img
                src={activeImage.src}
                alt={activeImage.alt || `Hình ảnh khóa học ${activeIndex + 1}`}
                className="h-full w-full object-cover transition-opacity duration-500"
            />

            {totalImages > 1 ? (
                <>
                    <button
                        type="button"
                        onClick={showPrevious}
                        className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-blue-950/75 text-white opacity-100 transition hover:bg-blue-950 sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label="Ảnh trước"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        type="button"
                        onClick={showNext}
                        className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-blue-950/75 text-white opacity-100 transition hover:bg-blue-950 sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label="Ảnh tiếp theo"
                    >
                        <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-blue-950/55 px-2 py-1.5">
                        {images.map((image, index) => (
                            <button
                                key={image.id || image.src || index}
                                type="button"
                                onClick={() => moveTo(index)}
                                className={`h-1.5 cursor-pointer rounded-full transition ${index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white"}`}
                                aria-label={`Xem ảnh ${index + 1}`}
                                aria-current={index === activeIndex ? "true" : undefined}
                            />
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
};
