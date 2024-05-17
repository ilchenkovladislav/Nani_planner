import { useState, type PointerEvent } from "react";

import {
    subMonths,
    addMonths,
    subWeeks,
    addWeeks,
    getWeekOfMonth,
} from "date-fns";

import { getDaysInMonthWithISOWeeks, getWeekDates } from "@/lib/calendarUtils";
import { DaysOfWeek } from "../DaysOfWeek/DaysOfWeek";
import { animated, useSpring } from "@react-spring/web";
import { Weeks } from "../Weeks/Weeks";
import "./MonthCalendar.css";
import { CalendarCarousel } from "../CalendarCarousel/CalendarCarousel";
import { CalendarDay } from "../CalendarDay/CalendarDay";
import { MyEditor } from "@/components/MyEditor/MyEditor";

type MonthCalendarProps = {
    currentDate: Date;
    onUpdateCurrentDate: (month: Date) => void;
};

const GAP = 20;
const ROW_HEIGHT = 40;
const HEIGHT_FOUR_WEEKS = GAP * 4 + ROW_HEIGHT * 4;

export function MonthCalendar({
    currentDate,
    onUpdateCurrentDate,
}: MonthCalendarProps) {
    const NUMBER_ROWS = getWeekOfMonth(currentDate, { weekStartsOn: 1 }) - 1;
    const HEIGHT_UP_SELECTED_WEEK =
        GAP * NUMBER_ROWS + ROW_HEIGHT * NUMBER_ROWS;
    const ratioY = HEIGHT_UP_SELECTED_WEEK / HEIGHT_FOUR_WEEKS;

    const prevMonth = subMonths(currentDate, 1);
    const nextMonth = addMonths(currentDate, 1);

    const [items, setItems] = useState([prevMonth, currentDate, nextMonth]);
    const [isOpened, setIsOpened] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });
    const [lastPosition, setLastPosition] = useState({
        y: 0,
    });

    const [verticalCalendar, verticalCalendarApi] = useSpring(() => ({ y: 0 }));

    const [verticalBottomBlock, verticalBottomBlockApi] = useSpring(() => ({
        y: 0,
    }));

    function shouldShowMonthView() {
        // === При открытом календаре ===
        if (isOpened) {
            return true;
        }

        // === При закрытом календаре ===
        if (isAnimating) {
            return true;
        }

        if (isTransitioning) {
            return true;
        }
        return false;
    }

    const datesInMonth = (date: Date) =>
        shouldShowMonthView()
            ? getDaysInMonthWithISOWeeks(date)
            : getWeekDates(date);

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
                        setIsAnimating(false);
                        setIsOpened(false);
                        setTimeout(() => {
                            verticalCalendarApi.set({ y: 0 });
                            setWeeklyItems();
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
                        setIsAnimating(false);
                        setTimeout(() => {
                            setWeeklyItems();
                            setIsOpened(false);
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

    function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
        setPointerStart({ x: e.clientX, y: e.clientY });
        setIsTransitioning(true);
    }

    function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
        const deltaY = lastPosition.y + e.clientY - pointerStart.y;

        if (deltaY <= -240) {
            verticalCalendarApi.set({ y: -240 });
            return;
        }

        if (deltaY >= 0) {
            verticalCalendarApi.set({ y: 0 });
            return;
        }

        verticalCalendarApi.set({ y: deltaY });
        verticalBottomBlockApi.set({ y: deltaY });
    }

    function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
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

    const setNextDates = () => {
        if (isOpened) {
            setItems((prev) => {
                return [prev[1], prev[2], addMonths(prev[2], 1)];
            });
        } else {
            setItems((prev) => {
                return [prev[1], prev[2], addWeeks(prev[2], 1)];
            });
        }
    };

    function handleNextSlide() {
        setNextDates();

        if (isOpened) {
            onUpdateCurrentDate(addMonths(currentDate, 1));
        } else {
            onUpdateCurrentDate(addWeeks(currentDate, 1));
        }
    }

    const setPrevDates = () => {
        if (isOpened) {
            setItems((prev) => {
                return [subMonths(prev[0], 1), prev[0], prev[1]];
            });
        } else {
            setItems((prev) => {
                return [subWeeks(prev[0], 1), prev[0], prev[1]];
            });
        }
    };

    function handlePrevSlide() {
        setPrevDates();

        if (isOpened) {
            onUpdateCurrentDate(subMonths(currentDate, 1));
        } else {
            onUpdateCurrentDate(subWeeks(currentDate, 1));
        }
    }

    function handleDayClick(day: Date) {
        onUpdateCurrentDate(day);
    }

    return (
        <div>
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
                        isMonthView={shouldShowMonthView()}
                        currentDate={currentDate}
                    />
                    <CalendarCarousel
                        onNext={handleNextSlide}
                        onPrev={handlePrevSlide}
                    >
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-7 gap-x-1 gap-y-5"
                            >
                                {datesInMonth(item).map((day) => (
                                    <CalendarDay
                                        key={day.toString()}
                                        isOpened={isOpened}
                                        onDayClick={handleDayClick}
                                        day={day}
                                        currentDate={currentDate}
                                        setPrevDates={setPrevDates}
                                        setNextDates={setNextDates}
                                    />
                                ))}
                            </div>
                        ))}
                    </CalendarCarousel>
                </div>
            </animated.div>
            <animated.div
                className="h-60 border-t bg-background"
                style={{
                    transform: verticalBottomBlock.y.to(
                        (y) => `translate3d(0, ${y}px, 0)`,
                    ),
                    touchAction: "none",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <MyEditor onFocus={closeCalendar} />
            </animated.div>
        </div>
    );
}
