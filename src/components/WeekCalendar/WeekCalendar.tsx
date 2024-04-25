import { isCurrentWeek, getWeekDates } from "@/lib/calendarUtils";
import { EmblaCarouselType } from "embla-carousel";
import { cn } from "@/lib/utils";
import {
    isSameDay,
    isToday,
    isSameMonth,
    format,
    getISOWeek,
    subWeeks,
    addWeeks,
} from "date-fns";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "../ui/carousel";
import { DaysOfWeek } from "../DaysOfWeek/DaysOfWeek";
import { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";

type WeekCalendarProps = {
    currentDate: Date;
    onUpdateCurrentDate: (date: Date) => void;
    kek: () => void;
    setPosY: (y: number) => void;
};

export function WeekCalendar({
    currentDate,
    onUpdateCurrentDate,
    kek,
    setPosY,
}: WeekCalendarProps) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [items, setItems] = useState<Date[]>([
        subWeeks(currentDate, 1),
        currentDate,
        addWeeks(currentDate, 1),
    ]);
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());

    function dayClickHandle(day: Date) {
        setSelectedDay(day);
    }

    useEffect(() => {
        if (!carouselApi) {
            return;
        }

        const handleSelect = (api: EmblaCarouselType) => {
            setTimeout(() => {
                setItems((prev) => {
                    if (api.selectedScrollSnap() > api.previousScrollSnap()) {
                        onUpdateCurrentDate(prev[2]);
                        return [prev[1], prev[2], addWeeks(prev[2], 1)];
                    } else {
                        onUpdateCurrentDate(prev[0]);
                        return [subWeeks(prev[0], 1), prev[0], prev[1]];
                    }
                });
            }, 700);
        };

        carouselApi.on("select", handleSelect);

        return () => {
            carouselApi.off("select", handleSelect);
        };
    }, [carouselApi]);

    useEffect(() => {
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

    type TouchCoordinates = {
        x: number | null;
        y: number | null;
    };

    const [startTouch, setStartTouch] = useState<TouchCoordinates>({
        x: null,
        y: null,
    });
    const [endTouch, setEndTouch] = useState<TouchCoordinates>({
        x: null,
        y: null,
    });

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        setStartTouch({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        setEndTouch({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = () => {
        const deltaX = (endTouch.x ?? 0) - (startTouch.x ?? 0);
        const deltaY = (endTouch.y ?? 0) - (startTouch.y ?? 0);

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return;
        } else {
            if (deltaY > 0) {
                api.start({
                    onStart: () => {
                        kek();
                        setPosY(-240);
                    },
                    to: {
                        y: 240,
                    },
                });
            } else {
                api.start({
                    to: {
                        y: 0,
                    },
                });
            }
        }

        setStartTouch({ x: null, y: null });
        setEndTouch({ x: null, y: null });
    };

    return (
        <>
            <DaysOfWeek />
            <animated.div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: springY.to((y) => `translate3d(0, ${y}px, 0)`),
                    touchAction: "none",
                }}
            >
                <div className="grid grid-cols-[30px_1fr]">
                    <div className="flex flex-col justify-between gap-y-5 border-r-[1px] text-center">
                        {
                            <div
                                className={cn(
                                    {
                                        "text-blue-500": isCurrentWeek(
                                            getISOWeek(currentDate),
                                        ),
                                    },
                                    "flex h-10 items-center justify-center",
                                )}
                            >
                                {getISOWeek(currentDate)}
                            </div>
                        }
                    </div>
                    <Carousel
                        opts={{ startIndex: 1, watchResize: false }}
                        setApi={setCarouselApi}
                    >
                        <CarouselContent>
                            {items.map((item, index) => (
                                <CarouselItem key={index}>
                                    <div className="grid grid-cols-7 gap-x-1 gap-y-5">
                                        {getWeekDates(item).map((day) => (
                                            <div
                                                className={cn(
                                                    {
                                                        "rounded-full border-[1px]":
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
        </>
    );
}
