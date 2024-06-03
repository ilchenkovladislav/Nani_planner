import { useCalendarCarouselSpringStore } from "@/store/calendarCarouselSpring";
import { useState, type PointerEvent } from "react";

const CALENDAR_WIDTH = 100;

export function useCalendarCarousel(onPrev?: () => void, onNext?: () => void) {
    const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });

    const { styles, stylesApi } = useCalendarCarouselSpringStore(
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

    function next(cb?: () => void) {
        stylesApi.start({
            to: {
                x: -CALENDAR_WIDTH * 2,
            },
            onResolve: async () => {
                if (!cb) return;

                await new Promise<void>((resolve) => {
                    cb();
                    resolve();
                });
                setTimeout(() => {
                    centeringCarousel();
                }, 0);
            },
        });
    }

    function cancel() {
        stylesApi.start({
            to: {
                x: -CALENDAR_WIDTH,
            },
        });
    }

    function prev(cb?: () => void) {
        stylesApi.start({
            to: {
                x: 0,
            },
            onResolve: async () => {
                if (!cb) return;

                await new Promise<void>((resolve) => {
                    cb();
                    resolve();
                });
                setTimeout(() => {
                    centeringCarousel();
                }, 0);
            },
        });
    }

    function centeringCarousel() {
        stylesApi.set({
            x: -CALENDAR_WIDTH,
        });
    }

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
        next,
        prev,
    };
}
