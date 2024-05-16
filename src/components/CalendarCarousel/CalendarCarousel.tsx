import { useState, type PointerEvent } from "react";
import { animated, useSpring } from "@react-spring/web";
import { CarouselContext } from "./context";

type CalendarCarouselProps = {
    children: React.ReactNode;
    onNext?: () => void;
    onPrev?: () => void;
};

const CALENDAR_WIDTH = 100;

export function CalendarCarousel({
    children,
    onNext,
    onPrev,
}: CalendarCarouselProps) {
    const [horizontalCalendar, horizontalCalendarApi] = useSpring(() => ({
        x: -CALENDAR_WIDTH,
    }));

    const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });

    const next = (cb?: () => void) => {
        horizontalCalendarApi.start({
            to: {
                x: -CALENDAR_WIDTH * 2,
            },
            onResolve: () => {
                if (cb) {
                    setTimeout(() => {
                        cb();
                    }, 0);
                }
                setTimeout(() => {
                    centeringCarousel();
                }, 1);
            },
        });
    };

    const canceled = () => {
        horizontalCalendarApi.start({
            to: {
                x: -CALENDAR_WIDTH,
            },
        });
    };

    const prev = (cb?: () => void) => {
        horizontalCalendarApi.start({
            to: {
                x: 0,
            },
            onResolve: () => {
                if (cb) {
                    setTimeout(() => {
                        cb();
                    }, 0);
                }
                setTimeout(() => {
                    centeringCarousel();
                }, 1);
            },
        });
    };

    function centeringCarousel() {
        horizontalCalendarApi.set({
            x: -CALENDAR_WIDTH,
        });
    }

    const handleCarouselPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        setPointerStart({ x: e.clientX, y: e.clientY });
    };

    const handleCarouselPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const deltaX = -CALENDAR_WIDTH + (e.clientX - pointerStart.x) / 5;

        horizontalCalendarApi.set({
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
            canceled();
        }
    };

    return (
        <CarouselContext.Provider value={{ next, prev }}>
            <div
                className="carousel-content-wrapper"
                onPointerDown={handleCarouselPointerDown}
                onPointerMove={handleCarouselPointerMove}
                onPointerUp={handleCarouselPointerUp}
            >
                <animated.div
                    className="carousel-content"
                    style={{
                        translate: horizontalCalendar.x.to((x) => `${x}%`),
                        touchAction: "none",
                    }}
                >
                    {children}
                </animated.div>
            </div>
        </CarouselContext.Provider>
    );
}
