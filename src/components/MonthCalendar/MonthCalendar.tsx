import { useEffect, useLayoutEffect, useState, type PointerEvent } from "react";

import { type CarouselApi } from "@/components/ui/carousel";
import { EmblaCarouselType } from "embla-carousel";
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

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import cn from "classnames";
import { getDaysInMonthWithISOWeeks, getWeekDates } from "@/lib/calendarUtils";
import { DaysOfWeek } from "../DaysOfWeek/DaysOfWeek";
import { animated, useSpring } from "@react-spring/web";
import { Weeks } from "../Weeks/Weeks";

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
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());

    const NUMBER_ROWS = getWeekOfMonth(selectedDay, { weekStartsOn: 1 }) - 1;
    const HEIGHT_UP_SELECTED_WEEK =
        GAP * NUMBER_ROWS + ROW_HEIGHT * NUMBER_ROWS;

    const [carouselApi, setCarouselApi] = useState<CarouselApi>();

    const prevMonth = subMonths(currentDate, 1);
    const nextMonth = addMonths(currentDate, 1);

    const [items, setItems] = useState([prevMonth, currentDate, nextMonth]);
    const [isOpened, setIsOpened] = useState(true);

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
    // 1. Открыт -> закрываем +
    // 2. Закрыт -> открываем +
    // 3. Открыт -> недозакрываем -
    // 4. Закрыт -> недооткрываем ?

    function closeCalendar() {
        setIsAnimating(true);
        switch (getWeekOfMonth(selectedDay)) {
            case 1: {
                bottomApi.start({
                    to: {
                        y: -HEIGHT_FOUR_WEEKS,
                    },
                    onRest: () => {
                        setIsOpened(false);
                        setIsAnimating(false);
                    },
                });

                break;
            }
            case 2:
            case 3:
            case 4: {
                bottomApi.start({
                    to: {
                        y: -HEIGHT_FOUR_WEEKS,
                    },
                });
                api.start({
                    to: {
                        y: -HEIGHT_UP_SELECTED_WEEK,
                    },
                    onRest: () => {
                        setIsOpened(false);
                        setIsAnimating(false);
                    },
                });

                break;
            }
            case 5: {
                api.start({
                    to: {
                        y: -HEIGHT_FOUR_WEEKS,
                    },
                    onRest: () => {
                        setIsOpened(false);
                        setIsAnimating(false);
                    },
                });
                bottomApi.start({
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
        switch (getWeekOfMonth(selectedDay)) {
            case 1: {
                bottomApi.start({
                    to: {
                        y: 0,
                    },
                    onStart: () => {
                        setIsOpened(true);
                    },
                    onRest: () => {
                        // TODO:: Нужно убрать обновление стейта при закрытии и открытии, потому что из-за этого происходит баг с слайдером
                        // setMonthlyItems();
                        setIsAnimating(false);
                    },
                });
                break;
            }
            case 2:
            case 3:
            case 4: {
                bottomApi.start({
                    to: {
                        y: 0,
                    },
                    onStart: () => {
                        setIsOpened(true);
                    },
                    onRest: () => {
                        // setMonthlyItems();
                        setIsAnimating(false);
                    },
                });
                api.start({
                    to: {
                        y: 0,
                    },
                });

                break;
            }
            case 5: {
                api.start({
                    to: {
                        y: 0,
                    },
                });
                bottomApi.start({
                    to: {
                        y: 0,
                    },
                    onStart: () => {
                        setIsOpened(true);
                    },
                    onRest: () => {
                        setIsAnimating(false);
                        // setMonthlyItems();
                    },
                });

                break;
            }
            default:
                break;
        }
    }

    function dayClickHandle(day: Date) {
        setSelectedDay(day);
        onUpdateCurrentDate(day);
    }

    useEffect(() => {
        if (!carouselApi) {
            return;
        }

        const handleSelect = (api: EmblaCarouselType) => {
            setTimeout(() => {
                if (isOpened) {
                    setItems((prev) => {
                        console.log(
                            api.selectedScrollSnap(),
                            api.previousScrollSnap(),
                        );

                        if (
                            api.selectedScrollSnap() > api.previousScrollSnap()
                        ) {
                            onUpdateCurrentDate(prev[2]);
                            setSelectedDay((prev) => addMonths(prev, 1));
                            return [prev[1], prev[2], addMonths(prev[2], 1)];
                        } else {
                            onUpdateCurrentDate(prev[0]);
                            setSelectedDay((prev) => subMonths(prev, 1));
                            return [subMonths(prev[0], 1), prev[0], prev[1]];
                        }
                    });
                } else {
                    setItems((prev) => {
                        if (
                            api.selectedScrollSnap() > api.previousScrollSnap()
                        ) {
                            onUpdateCurrentDate(prev[2]);
                            setSelectedDay((prev) => addWeeks(prev, 1));
                            return [prev[1], prev[2], addWeeks(prev[2], 1)];
                        } else {
                            onUpdateCurrentDate(prev[0]);
                            setSelectedDay((prev) => subWeeks(prev, 1));
                            return [subWeeks(prev[0], 1), prev[0], prev[1]];
                        }
                    });
                }
            }, 700);
        };

        carouselApi.on("select", handleSelect);

        return () => {
            carouselApi.off("select", handleSelect);
        };
    }, [carouselApi, isOpened]);

    useLayoutEffect(() => {
        if (!carouselApi) {
            return;
        }

        carouselApi.reInit({
            startIndex: 1,
        });
    }, [carouselApi, items]);

    const [{ y: springY }, api] = useSpring(() => ({
        from: { y: 0 },
    }));

    const [{ y: bottomY }, bottomApi] = useSpring(() => ({
        from: { y: 0 },
    }));

    const datesInMonth = (date: Date) =>
        isOpened || isTransitioning || isAnimating
            ? getDaysInMonthWithISOWeeks(date)
            : getWeekDates(date);

    const [posY, setPosY] = useState(0);
    const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });
    const [lastY, setLastY] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const [ratioY, setRatioY] = useState(
        HEIGHT_UP_SELECTED_WEEK / HEIGHT_FOUR_WEEKS,
    );
    useEffect(() => {
        setRatioY(HEIGHT_UP_SELECTED_WEEK / HEIGHT_FOUR_WEEKS);
    }, [selectedDay]);

    function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
        const deltaY = lastY + e.clientY - pointerStart.y;

        if (deltaY <= -240) {
            setPosY(-240);
            return;
        }

        if (deltaY >= 0) {
            setPosY(0);
            return;
        }

        setPosY(deltaY);
    }

    function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
        const deltaY = lastY + e.clientY - pointerStart.y;
        setLastY(posY);
        api.set({
            y: posY * ratioY,
        });
        bottomApi.set({
            y: posY,
        });

        if (pointerStart.y - e.clientY >= 0) {
            if (deltaY <= -50) {
                closeCalendar();
                setLastY(-240);
                setPosY(-240);
            } else {
                openCalendar();
                setLastY(0);
                setPosY(0);
            }
        } else {
            if (deltaY >= -240 + 50) {
                openCalendar();
                setLastY(0);
                setPosY(0);
            } else {
                closeCalendar();
                setLastY(-240);
                setPosY(-240);
            }
        }
    }

    function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
        setPointerStart({ x: e.clientX, y: e.clientY });
        setIsTransitioning(true);
    }

    useLayoutEffect(() => {
        if (isAnimating) return;

        console.log("layouteffect");

        if (isOpened) {
            setMonthlyItems();
        } else {
            setWeeklyItems();
        }
    }, [isAnimating]);

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <DaysOfWeek />
            <animated.div
                style={{
                    transform: springY.to((y) =>
                        isAnimating
                            ? `translate3d(0, ${y}px, 0)`
                            : `translate3d(0, ${posY * ratioY}px, 0)`,
                    ),
                    // transform: springY.to((y) => `translate3d(0, ${y}px, 0)`),
                    touchAction: "none",
                }}
            >
                <div className="grid h-[280px] grid-cols-[30px_1fr]">
                    <Weeks
                        isOpened={isOpened || isTransitioning}
                        currentDate={currentDate}
                    />
                    <Carousel
                        opts={{ startIndex: 1, watchResize: false }}
                        setApi={setCarouselApi}
                    >
                        <CarouselContent>
                            {items.map((item, index) => (
                                <CarouselItem key={index}>
                                    <div className="grid grid-cols-7 gap-x-1 gap-y-5">
                                        {datesInMonth(item).map((day) => (
                                            <div
                                                className={cn(
                                                    {
                                                        "rounded-full border":
                                                            isSameDay(
                                                                day,
                                                                selectedDay,
                                                            ),
                                                        "text-blue-500":
                                                            isToday(day),
                                                        "text-gray-400":
                                                            !isSameMonth(
                                                                item,
                                                                day,
                                                            ),
                                                    },
                                                    "flex size-10 items-center justify-center justify-self-center text-lg",
                                                )}
                                                key={day.toString()}
                                                onClick={() =>
                                                    dayClickHandle(day)
                                                }
                                            >
                                                {format(day, "d")}
                                            </div>
                                        ))}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </animated.div>
            <animated.div
                className="h-60 bg-white text-yellow-500"
                style={{
                    transform: bottomY.to((y) =>
                        isAnimating
                            ? `translate3d(0, ${y}px, 0)`
                            : `translate3d(0, ${posY}px, 0)`,
                    ),
                    touchAction: "none",
                }}
            />
        </div>
    );
}
