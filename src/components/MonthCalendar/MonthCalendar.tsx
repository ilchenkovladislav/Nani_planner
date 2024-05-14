import { useEffect, useState, type PointerEvent } from "react";

import {
    isToday,
    format,
    isSameDay,
    isSameMonth,
    subMonths,
    addMonths,
    subWeeks,
    addWeeks,
    getWeekOfMonth,
} from "date-fns";

import cn from "classnames";
import { getDaysInMonthWithISOWeeks, getWeekDates } from "@/lib/calendarUtils";
import { DaysOfWeek } from "../DaysOfWeek/DaysOfWeek";
import { animated, useSpring } from "@react-spring/web";
import { Weeks } from "../Weeks/Weeks";
import "./MonthCalendar.css";

type MonthCalendarProps = {
    currentDate: Date;
    onUpdateCurrentDate: (month: Date) => void;
};

const GAP = 20;
const ROW_HEIGHT = 40;
const HEIGHT_FOUR_WEEKS = GAP * 4 + ROW_HEIGHT * 4;
const CALENDAR_WIDTH = 400;

export function MonthCalendar({
    currentDate,
    onUpdateCurrentDate,
}: MonthCalendarProps) {
    const NUMBER_ROWS = getWeekOfMonth(currentDate, { weekStartsOn: 1 }) - 1;
    const HEIGHT_UP_SELECTED_WEEK =
        GAP * NUMBER_ROWS + ROW_HEIGHT * NUMBER_ROWS;

    const prevMonth = subMonths(currentDate, 1);
    const nextMonth = addMonths(currentDate, 1);

    const [items, setItems] = useState([prevMonth, currentDate, nextMonth]);
    const [isOpened, setIsOpened] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });
    const [lastPosition, setLastPosition] = useState({
        x: -CALENDAR_WIDTH,
        y: 0,
    });

    const [allowedDirection, setAllowedDirection] = useState<
        "horizontal" | "vertical" | null
    >(null);

    const [verticalCalendar, verticalCalendarApi] = useSpring(() => ({ y: 0 }));

    const [verticalBottomBlock, verticalBottomBlockApi] = useSpring(() => ({
        y: 0,
    }));

    const [horizontalCalendar, horizontalCalendarApi] = useSpring(() => ({
        from: { x: -CALENDAR_WIDTH },
    }));

    const datesInMonth = (date: Date) =>
        allowedDirection !== "vertical" && !isOpened
            ? getWeekDates(date)
            : isOpened ||
                (isTransitioning && allowedDirection !== "horizontal") ||
                (isAnimating && allowedDirection === "vertical")
              ? getDaysInMonthWithISOWeeks(date)
              : getWeekDates(date);

    const [ratioY, setRatioY] = useState(
        HEIGHT_UP_SELECTED_WEEK / HEIGHT_FOUR_WEEKS,
    );
    useEffect(() => {
        setRatioY(HEIGHT_UP_SELECTED_WEEK / HEIGHT_FOUR_WEEKS);
    }, [currentDate]);

    function setWeeklyItems() {
        const getWeeklyItems = (currentDate: Date): Date[] => [
            subWeeks(currentDate, 1),
            currentDate,
            addWeeks(currentDate, 1),
        ];
        const items = getWeeklyItems(currentDate);
        setItems(items);
    }

    function setMonthlyItems() {
        const getMonthlyItems = (currentDate: Date): Date[] => [
            prevMonth,
            currentDate,
            nextMonth,
        ];
        const items = getMonthlyItems(currentDate);
        setItems(items);
    }

    function closeCalendar() {
        setIsAnimating(true);
        switch (getWeekOfMonth(currentDate)) {
            case 1: {
                verticalBottomBlockApi.start({
                    to: {
                        y: -HEIGHT_FOUR_WEEKS,
                    },
                    onResolve: () => {
                        setWeeklyItems();
                        setIsOpened(false);
                        setIsAnimating(false);
                    },
                });

                break;
            }
            case 2:
            case 3:
            case 4: {
                verticalBottomBlockApi.start({
                    to: {
                        y: -HEIGHT_FOUR_WEEKS,
                    },
                });
                verticalCalendarApi.start({
                    to: {
                        y: -HEIGHT_FOUR_WEEKS,
                    },
                    onResolve: () => {
                        setWeeklyItems();
                        setIsAnimating(false);
                        setIsOpened(false);
                        setTimeout(() => {
                            verticalCalendarApi.set({ y: 0 });
                        }, 0);
                    },
                });

                break;
            }
            case 5: {
                verticalCalendarApi.start({
                    to: {
                        y: -HEIGHT_FOUR_WEEKS,
                    },
                    onResolve: () => {
                        setWeeklyItems();
                        setIsAnimating(false);
                        setTimeout(() => {
                            verticalCalendarApi.set({ y: 0 });
                            setIsOpened(false);
                        }, 0);
                    },
                });
                verticalBottomBlockApi.start({
                    to: {
                        y: -HEIGHT_FOUR_WEEKS,
                    },
                });

                break;
            }
            default:
                break;
        }
    }

    function openCalendar() {
        setIsAnimating(true);
        switch (getWeekOfMonth(currentDate)) {
            case 1: {
                verticalBottomBlockApi.start({
                    to: {
                        y: 0,
                    },
                    onStart: () => {
                        setIsOpened(true);
                    },
                    onResolve: () => {
                        setMonthlyItems();
                        setIsAnimating(false);
                        setTimeout(() => {
                            verticalCalendarApi.set({ y: 0 });
                        }, 0);
                    },
                });
                break;
            }
            case 2:
            case 3:
            case 4: {
                verticalBottomBlockApi.start({
                    to: {
                        y: 0,
                    },
                    onStart: () => {
                        setIsOpened(true);
                    },
                    onResolve: () => {
                        setMonthlyItems();
                        setIsAnimating(false);
                    },
                });
                verticalCalendarApi.start({
                    to: {
                        y: 0,
                    },
                });

                break;
            }
            case 5: {
                verticalCalendarApi.start({
                    to: {
                        y: 0,
                    },
                });
                verticalBottomBlockApi.start({
                    to: {
                        y: 0,
                    },
                    onStart: () => {
                        setIsOpened(true);
                    },
                    onResolve: () => {
                        setMonthlyItems();
                        setIsAnimating(false);
                    },
                });

                break;
            }
            default:
                break;
        }
    }

    function dayClickHandle(day: Date) {
        onUpdateCurrentDate(day);
    }

    function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
        setPointerStart({ x: e.clientX, y: e.clientY });
        setIsTransitioning(true);
        setAllowedDirection(null);
    }

    function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
        if (allowedDirection === "horizontal") return;

        const deltaY = lastPosition.y + e.clientY - pointerStart.y;

        verticalCalendarApi.set({ y: deltaY });

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

        if (deltaY <= -240) {
            verticalCalendarApi.set({ y: -240 });
            return;
        }

        if (deltaY >= 0) {
            verticalCalendarApi.set({ y: 0 });
            return;
        }

        verticalBottomBlockApi.set({ y: deltaY });
    }

    function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
        if (!allowedDirection || allowedDirection === "horizontal") return;

        const deltaY = lastPosition.y + e.clientY - pointerStart.y;

        if (pointerStart.y - e.clientY >= 0) {
            if (deltaY <= -50) {
                closeCalendar();
                setLastPosition((prev) => ({
                    ...prev,
                    y: -HEIGHT_FOUR_WEEKS,
                }));
            } else {
                openCalendar();
                setLastPosition((prev) => ({ ...prev, y: 0 }));
            }
        } else {
            if (deltaY >= -240 + 50) {
                openCalendar();
                setLastPosition((prev) => ({ ...prev, y: 0 }));
            } else {
                closeCalendar();
                setLastPosition((prev) => ({
                    ...prev,
                    y: -HEIGHT_FOUR_WEEKS,
                }));
            }
        }
        setIsTransitioning(false);
    }

    const next = () => {
        setIsAnimating(true);

        horizontalCalendarApi.start({
            to: {
                x: -CALENDAR_WIDTH * 2,
            },
            onResolve: () => {
                setTimeout(() => {
                    if (isOpened) {
                        setItems((prev) => {
                            onUpdateCurrentDate(prev[2]);
                            return [prev[1], prev[2], addMonths(prev[2], 1)];
                        });
                    } else {
                        setItems((prev) => {
                            onUpdateCurrentDate(prev[2]);
                            return [prev[1], prev[2], addWeeks(prev[2], 1)];
                        });
                    }

                    horizontalCalendarApi.set({
                        x: -CALENDAR_WIDTH,
                    });

                    setLastPosition((prev) => ({
                        ...prev,
                        x: -CALENDAR_WIDTH,
                    }));
                }, 0);
                setIsAnimating(false);
            },
        });
    };

    const canceled = () => {
        setIsAnimating(true);

        horizontalCalendarApi.start({
            to: {
                x: -CALENDAR_WIDTH,
            },
            onResolve: () => {
                setIsAnimating(false);
            },
        });
    };

    const prev = () => {
        setIsAnimating(true);

        horizontalCalendarApi.start({
            to: {
                x: 0,
            },
            onResolve: () => {
                setTimeout(() => {
                    if (isOpened) {
                        setItems((prev) => {
                            onUpdateCurrentDate(prev[0]);
                            return [subMonths(prev[0], 1), prev[0], prev[1]];
                        });
                    } else {
                        setItems((prev) => {
                            onUpdateCurrentDate(prev[0]);
                            return [subWeeks(prev[0], 1), prev[0], prev[1]];
                        });
                    }

                    horizontalCalendarApi.set({
                        x: -CALENDAR_WIDTH,
                    });

                    setLastPosition((prev) => ({
                        ...prev,
                        x: -CALENDAR_WIDTH,
                    }));
                }, 0);
                setIsAnimating(false);
            },
        });
    };

    const handleCarouselPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        setPointerStart({ x: e.clientX, y: e.clientY });
    };

    const handleCarouselPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (allowedDirection === "vertical") return;
        verticalCalendarApi.set({ y: 0 });

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
            setLastPosition((prev) => ({ ...prev, x: 0 }));
        } else if (deltaX <= -100) {
            next();
            setLastPosition((prev) => ({
                ...prev,
                x: -CALENDAR_WIDTH * 2,
            }));
        } else {
            canceled();
            setLastPosition((prev) => ({
                ...prev,
                x: -CALENDAR_WIDTH,
            }));
        }

        setIsTransitioning(false);
    };

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <DaysOfWeek />
            <animated.div
                style={{
                    transform: verticalCalendar.y.to(
                        (y) => `translate3d(0, ${y * ratioY}px, 0)`,
                    ),
                    touchAction: "none",
                }}
            >
                <div className="grid h-[280px] grid-cols-[30px_1fr]">
                    <Weeks
                        isOpened={
                            allowedDirection !== "vertical" && !isOpened
                                ? false
                                : isOpened ||
                                    (isTransitioning &&
                                        allowedDirection !== "horizontal") ||
                                    (isAnimating &&
                                        allowedDirection === "vertical")
                                  ? true
                                  : false
                        }
                        currentDate={currentDate}
                    />
                    <div
                        className="carousel-content-wrapper"
                        onPointerDown={handleCarouselPointerDown}
                        onPointerMove={handleCarouselPointerMove}
                        onPointerUp={handleCarouselPointerUp}
                    >
                        <animated.div
                            className="carousel-content"
                            style={{
                                translate: horizontalCalendar.x.to(
                                    (x) => `${x}px`,
                                ),
                            }}
                        >
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-7 gap-x-1 gap-y-5"
                                >
                                    {datesInMonth(item).map((day) => (
                                        <div
                                            className={cn(
                                                {
                                                    "rounded-full border":
                                                        isSameDay(
                                                            day,
                                                            currentDate,
                                                        ),
                                                    "text-blue-500":
                                                        isToday(day),
                                                    "text-gray-400":
                                                        !isSameMonth(item, day),
                                                },
                                                "flex size-10 items-center justify-center justify-self-center text-lg",
                                            )}
                                            key={day.toString()}
                                            onClick={() => dayClickHandle(day)}
                                        >
                                            {format(day, "d")}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </animated.div>
                    </div>
                </div>
            </animated.div>
            <animated.div
                className="h-60 bg-white text-yellow-500"
                style={{
                    transform: verticalBottomBlock.y.to(
                        (y) => `translate3d(0, ${y}px, 0)`,
                    ),
                    touchAction: "none",
                }}
            />
        </div>
    );
}
