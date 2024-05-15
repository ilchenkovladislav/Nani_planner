import { useState, type PointerEvent } from "react";
import { animated, useSpring } from "@react-spring/web";
import { CarouselContext } from "./context";

type CalendarCarouselProps = {
    children: React.ReactNode;
    onNext?: () => void;
    onPrev?: () => void;
    widthContent?: number;
};

const CALENDAR_WIDTH = 400;

export function CalendarCarousel({
    children,
    onNext,
    onPrev,
    widthContent = CALENDAR_WIDTH,
}: CalendarCarouselProps) {
    const [horizontalCalendar, horizontalCalendarApi] = useSpring(() => ({
        x: -widthContent,
    }));

    const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });

    const [allowedDirection, setAllowedDirection] = useState<
        "horizontal" | "vertical" | null
    >(null);

    const next = (cb?: () => void) => {
        horizontalCalendarApi.start({
            to: {
                x: -widthContent * 2,
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
                x: -widthContent,
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
            x: -widthContent,
        });
    }

    const handleCarouselPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        setPointerStart({ x: e.clientX, y: e.clientY });
        setAllowedDirection(null);
    };

    const handleCarouselPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (allowedDirection === "vertical") return;

        if (allowedDirection === null) {
            if (
                Math.abs(e.clientX - pointerStart.x) >
                Math.abs(e.clientY - pointerStart.y)
            ) {
                setAllowedDirection("horizontal");
            } else {
                setAllowedDirection("vertical");
                return;
            }
        }

        const deltaX = -widthContent + e.clientX - pointerStart.x;

        horizontalCalendarApi.set({
            x: deltaX,
        });
    };

    const handleCarouselPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        if (allowedDirection === "vertical") return;

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
                        translate: horizontalCalendar.x.to((x) => `${x}px`),
                        touchAction: "none",
                    }}
                >
                    {children}
                </animated.div>
            </div>
        </CarouselContext.Provider>
    );
}
