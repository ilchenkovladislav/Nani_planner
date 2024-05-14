import { useState, type PointerEvent } from "react";
import { animated, useSpring } from "@react-spring/web";

type CalendarCarouselProps = {
    children: React.ReactNode;
    onNext: () => void;
    onPrev: () => void;
};

const CALENDAR_WIDTH = 400;

export function CalendarCarousel({
    children,
    onNext,
    onPrev,
}: CalendarCarouselProps) {
    const [horizontalCalendar, horizontalCalendarApi] = useSpring(() => ({
        from: { x: -CALENDAR_WIDTH },
    }));

    const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });
    const [lastPosition, setLastPosition] = useState({
        x: -CALENDAR_WIDTH,
    });

    const [allowedDirection, setAllowedDirection] = useState<
        "horizontal" | "vertical" | null
    >(null);

    const next = () => {
        horizontalCalendarApi.start({
            to: {
                x: -CALENDAR_WIDTH * 2,
            },
            onResolve: () => {
                setTimeout(() => {
                    onNext();
                    centeringCarousel();
                }, 0);
            },
        });
    };

    const canceled = () => {
        horizontalCalendarApi.start({
            to: {
                x: -CALENDAR_WIDTH,
            },
            onResolve: () => {
                setLastPosition((prev) => ({
                    ...prev,
                    x: -CALENDAR_WIDTH,
                }));
            },
        });
    };

    const prev = () => {
        horizontalCalendarApi.start({
            to: {
                x: 0,
            },
            onResolve: () => {
                setTimeout(() => {
                    onPrev();
                    centeringCarousel();
                }, 0);
            },
        });
    };

    function centeringCarousel() {
        horizontalCalendarApi.set({
            x: -CALENDAR_WIDTH,
        });

        setLastPosition((prev) => ({
            ...prev,
            x: -CALENDAR_WIDTH,
        }));
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
            }

            return;
        }

        const deltaX = lastPosition.x + e.clientX - pointerStart.x;

        horizontalCalendarApi.set({
            x: deltaX,
        });
    };

    const handleCarouselPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        if (allowedDirection === "vertical") return;

        const deltaX = e.clientX - pointerStart.x;
        setLastPosition((prev) => ({ ...prev, x: horizontalCalendar.x.get() }));

        if (deltaX >= 100) {
            prev();
        } else if (deltaX <= -100) {
            next();
        } else {
            canceled();
        }
    };

    return (
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
                }}
            >
                {children}
            </animated.div>
        </div>
    );
}
