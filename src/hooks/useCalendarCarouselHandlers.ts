import { useCalendarCarousel } from "@/store/useCalendarCarousel";
import { useState, type PointerEvent } from "react";

const CALENDAR_WIDTH = 100;

export function useCalendarCarouselHandlers(
    onPrev?: () => void,
    onNext?: () => void,
) {
    const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });

    const { cancel, next, prev, styles, stylesApi } = useCalendarCarousel(
        (state) => state,
    );

    const handleCarouselPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        setPointerStart({ x: e.clientX, y: e.clientY });
    };

    const handleCarouselPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const deltaX = -CALENDAR_WIDTH + (e.clientX - pointerStart.x) / 5;

        stylesApi.set({
            x: deltaX,
        });
    };

    const handleCarouselPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        const deltaX = e.clientX - pointerStart.x;

        if (deltaX >= 100) {
            prev(onPrev);
        } else if (deltaX <= -100) {
            next(onNext);
        } else {
            cancel();
        }
    };

    return {
        handlers: {
            onPointerDown: handleCarouselPointerDown,
            onPointerMove: handleCarouselPointerMove,
            onPointerUp: handleCarouselPointerUp,
        },
        styles,
    };
}
