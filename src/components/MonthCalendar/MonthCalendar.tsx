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
    // const [selectedDay, setSelectedDay] = useState<Date>(new Date());

    const NUMBER_ROWS = getWeekOfMonth(currentDate, { weekStartsOn: 1 }) - 1;
    const HEIGHT_UP_SELECTED_WEEK =
        GAP * NUMBER_ROWS + ROW_HEIGHT * NUMBER_ROWS;

    const prevMonth = subMonths(currentDate, 1);
    const nextMonth = addMonths(currentDate, 1);

    const [items, setItems] = useState([prevMonth, currentDate, nextMonth]);
    const [isOpened, setIsOpened] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    // const [position, setPosition] = useState({ x: -CALENDAR_WIDTH, y: 0 });
    const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });
    const [lastPosition, setLastPosition] = useState({
        x: -CALENDAR_WIDTH,
        y: 0,
    });

    const [verticalCalendar, verticalCalendarApi] = useSpring(() => ({ y: 0 }));

    const [verticalBottomBlock, verticalBottomBlockApi] = useSpring(() => ({
        y: 0,
    }));

    const [horizontalCalendar, horizontalCalendarApi] = useSpring(() => ({
        from: { x: -CALENDAR_WIDTH },
    }));

    const datesInMonth = (date: Date) =>
        isOpened || isTransitioning || isAnimating
            ? getDaysInMonthWithISOWeeks(date)
            : getWeekDates(date);

    const [ratioY, setRatioY] = useState(
        HEIGHT_UP_SELECTED_WEEK / HEIGHT_FOUR_WEEKS,
    );
    useEffect(() => {
        setRatioY(HEIGHT_UP_SELECTED_WEEK / HEIGHT_FOUR_WEEKS);
    }, [currentDate]);

    const [allowedDirection, setAllowedDirection] = useState<
        "horizontal" | "vertical" | null
    >(null);

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
                    onRest: () => {
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
                    onRest: () => {
                        setWeeklyItems();
                        setIsOpened(false);
                        setIsAnimating(false);
                        setTimeout(() => {
                            verticalCalendarApi.set({ y: 0 });
                            // setPosition((prev) => ({ ...prev, y: 0 }));
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
                    onRest: () => {
                        setWeeklyItems();
                        setIsOpened(false);
                        setIsAnimating(false);
                        setTimeout(() => {
                            verticalCalendarApi.set({ y: 0 });
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
                    onRest: () => {
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
                    onRest: () => {
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
                    onRest: () => {
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
        // setSelectedDay(day);
        onUpdateCurrentDate(day);
    }

    function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
        setPointerStart({ x: e.clientX, y: e.clientY });

        if (!isOpened) {
            console.log(-HEIGHT_FOUR_WEEKS);
            // verticalCalendarApi.set({ y: -HEIGHT_FOUR_WEEKS });
            verticalCalendarApi.set({ y: -HEIGHT_FOUR_WEEKS + 0.5 });
        }
        setIsTransitioning(true);
        setAllowedDirection(null);
    }

    function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
        if (allowedDirection === "horizontal") return;

        if (allowedDirection === null) {
            // Determine the direction of the initial movement
            if (
                Math.abs(e.clientX - pointerStart.x) >
                Math.abs(e.clientY - pointerStart.y)
            ) {
                setAllowedDirection("horizontal");
            } else {
                setAllowedDirection("vertical");
            }
        }

        const deltaY = lastPosition.y + e.clientY - pointerStart.y;

        if (deltaY <= -240) {
            // setPosition((prev) => ({ ...prev, y: -240 }));

            verticalCalendarApi.set({ y: -240 });
            // verticalCalendarApi.set({ y: -HEIGHT_UP_SELECTED_WEEK });
            return;
        }

        if (deltaY >= 0) {
            // setPosition((prev) => ({ ...prev, y: 0 }));
            verticalCalendarApi.set({ y: 0 });
            return;
        }

        verticalCalendarApi.set({ y: deltaY });
        verticalBottomBlockApi.set({ y: deltaY });

        // setPosition((prev) => ({ ...prev, y: deltaY }));
    }

    function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
        if (allowedDirection === "horizontal") return;

        const deltaY = lastPosition.y + e.clientY - pointerStart.y;
        setLastPosition((prev) => ({ ...prev, y: verticalCalendar.y.get() }));
        // verticalCalendarApi.set((y) => ({
        //     y: y * ratioY,
        // }));

        // verticalBottomBlockApi.set({
        //     y: verticalCalendar.y.get(),
        // });

        if (pointerStart.y - e.clientY >= 0) {
            if (deltaY <= -50) {
                closeCalendar();
                setLastPosition((prev) => ({
                    ...prev,
                    y: -HEIGHT_FOUR_WEEKS,
                }));
                // setPosition((prev) => ({ ...prev, y: -240 }));
                // verticalCalendarApi.set({ y: -240 });
            } else {
                openCalendar();
                setLastPosition((prev) => ({ ...prev, y: 0 }));
                // setPosition((prev) => ({ ...prev, y: 0 }));
                // verticalCalendarApi.set({ y: 0 });
            }
        } else {
            if (deltaY >= -240 + 50) {
                openCalendar();
                setLastPosition((prev) => ({ ...prev, y: 0 }));
                // setPosition((prev) => ({ ...prev, y: 0 }));
                // verticalCalendarApi.set({ y: 0 });
            } else {
                closeCalendar();
                setLastPosition((prev) => ({
                    ...prev,
                    y: -HEIGHT_FOUR_WEEKS,
                }));
                // setPosition((prev) => ({ ...prev, y: -240 }));
                // verticalCalendarApi.set({ y: -240 });
            }
        }
        setIsTransitioning(false);
    }

    // const next = () => {
    //     setIsAnimating(true);

    //     horizontalCalendarApi.start({
    //         to: {
    //             x: -CALENDAR_WIDTH * 2,
    //         },
    //         onRest: () => {
    //             setTimeout(() => {
    //                 if (isOpened) {
    //                     setItems((prev) => {
    //                         console.log([
    //                             prev[1],
    //                             prev[2],
    //                             addMonths(prev[2], 1),
    //                         ]);
    //                         // onUpdateCurrentDate(prev[2]);
    //                         // setSelectedDay((prev) => addMonths(prev, 1));
    //                         return [prev[1], prev[2], addMonths(prev[2], 1)];
    //                     });
    //                 } else {
    //                     setItems((prev) => {
    //                         console.log([
    //                             prev[1],
    //                             prev[2],
    //                             addWeeks(prev[2], 1),
    //                         ]);
    //                         // onUpdateCurrentDate(prev[2]);
    //                         // setSelectedDay((prev) => addWeeks(prev, 1));
    //                         return [prev[1], prev[2], addWeeks(prev[2], 1)];
    //                     });
    //                 }

    //                 horizontalCalendarApi.set({
    //                     x: -CALENDAR_WIDTH,
    //                 });

    //                 // setPosition((prev) => ({ ...prev, x: -CALENDAR_WIDTH }));
    //                 setLastPosition((prev) => ({
    //                     ...prev,
    //                     x: -CALENDAR_WIDTH,
    //                 }));
    //             }, 700);
    //             setIsAnimating(false);
    //         },
    //     });
    // };

    // const canceled = () => {
    //     setIsAnimating(true);

    //     horizontalCalendarApi.start({
    //         to: {
    //             x: -CALENDAR_WIDTH,
    //         },
    //     });
    // };

    // const prev = () => {
    //     setIsAnimating(true);

    //     horizontalCalendarApi.start({
    //         to: {
    //             x: 0,
    //         },
    //         onRest: () => {
    //             setTimeout(() => {
    //                 if (isOpened) {
    //                     setItems((prev) => {
    //                         // onUpdateCurrentDate(prev[0]);
    //                         setSelectedDay((prev) => subMonths(prev, 1));
    //                         return [subMonths(prev[0], 1), prev[0], prev[1]];
    //                     });
    //                 } else {
    //                     setItems((prev) => {
    //                         // onUpdateCurrentDate(prev[0]);
    //                         setSelectedDay((prev) => subWeeks(prev, 1));
    //                         return [subWeeks(prev[0], 1), prev[0], prev[1]];
    //                     });
    //                 }

    //                 horizontalCalendarApi.set({
    //                     x: -CALENDAR_WIDTH,
    //                 });

    //                 // setPosition((prev) => ({ ...prev, x: -CALENDAR_WIDTH }));
    //                 setLastPosition((prev) => ({
    //                     ...prev,
    //                     x: -CALENDAR_WIDTH,
    //                 }));
    //             }, 700);
    //             setIsAnimating(false);
    //         },
    //     });
    // };

    // const handleCarouselPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    //     setPointerStart({ x: e.clientX, y: e.clientY });
    // };

    // const handleCarouselPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    //     const deltaX = lastPosition.x + e.clientX - pointerStart.x;

    //     horizontalCalendarApi.set({
    //         x: deltaX,
    //     });
    //     // setPosition((prev) => ({ ...prev, x: deltaX }));
    // };

    // const handleCarouselPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    //     const deltaX = e.clientX - pointerStart.x;
    //     setLastPosition((prev) => ({ ...prev, x: horizontalCalendar.x.get() }));
    //     // horizontalCalendarApi.set({
    //     //     x: position.x,
    //     // });

    //     if (deltaX >= 100) {
    //         prev();
    //         setLastPosition((prev) => ({ ...prev, x: 0 }));
    //         // setPosition((prev) => ({ ...prev, x: 0 }));
    //         horizontalCalendarApi.set({
    //             x: 0,
    //         });
    //     } else if (deltaX <= -100) {
    //         next();
    //         setLastPosition((prev) => ({
    //             ...prev,
    //             x: -CALENDAR_WIDTH * 2,
    //         }));
    //         // setPosition((prev) => ({ ...prev, x: -CALENDAR_WIDTH * 2 }));
    //         horizontalCalendarApi.set({
    //             x: -CALENDAR_WIDTH * 2,
    //         });
    //     } else {
    //         canceled();
    //         setLastPosition((prev) => ({
    //             ...prev,
    //             x: -CALENDAR_WIDTH,
    //         }));
    //         // setPosition((prev) => ({ ...prev, x: -CALENDAR_WIDTH }));
    //         horizontalCalendarApi.set({
    //             x: -CALENDAR_WIDTH,
    //         });
    //     }
    // };

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
                        // isAnimating
                        //     ? `translate3d(0, ${y}px, 0)`
                        //     : `translate3d(0, ${position.y * ratioY}px, 0)`,
                    ),
                    touchAction: "none",
                }}
            >
                <div className="grid h-[280px] grid-cols-[30px_1fr]">
                    <Weeks
                        isOpened={isOpened || isTransitioning || isAnimating}
                        currentDate={currentDate}
                    />
                    <div
                        className="carousel-content-wrapper"
                        // onPointerDown={handleCarouselPointerDown}
                        // onPointerMove={handleCarouselPointerMove}
                        // onPointerUp={handleCarouselPointerUp}
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
