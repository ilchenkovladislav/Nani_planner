import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { EmblaCarouselType } from "embla-carousel";
import cn from "classnames";
import {
    eachDayOfInterval,
    endOfISOWeek,
    endOfMonth,
    startOfISOWeek,
    startOfMonth,
    isToday,
    format,
    isSameDay,
    isSameMonth,
    getISOWeek,
    subMonths,
    addMonths,
    addDays,
} from "date-fns";
import { ru } from "date-fns/locale";

const days: number[] = [];

for (let i = 1; i < 31; i++) {
    days.push(i);
}

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

const DaysOfWeek = () => (
    <div className="ml-[30px] grid grid-cols-7 gap-3 border-b-[1px] py-1">
        {daysOfWeek.map((el) => (
            <div className="text-center text-xs" key={el}>
                {el}
            </div>
        ))}
    </div>
);

export function getDates(date: Date): Date[] {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(monthStart);
    const start = startOfISOWeek(monthStart);
    const end = endOfISOWeek(monthEnd);

    return [...eachDayOfInterval({ start, end })];
}

// TODO:: Переделать, работает, но выглядит ужасно
function getWeeks(date: Date): number[] {
    const weeks = new Set<number>();
    const currentMonth = date.getMonth();
    let checker = date;

    while (checker.getMonth() === currentMonth) {
        const weekNumber = getISOWeek(checker);
        weeks.add(weekNumber);
        checker = addDays(checker, 1);
    }
    return [...weeks];
}

function isCurrentWeek(week: number) {
    const today = new Date();
    return getISOWeek(today) === week;
}

function App() {
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2024, 2));
    const [api, setApi] = useState<CarouselApi>();

    const prevMonth = subMonths(currentMonth, 1);
    const nextMonth = addMonths(currentMonth, 1);

    const [items, setItems] = useState([prevMonth, currentMonth, nextMonth]);

    function dayClickHandle(day: Date) {
        setSelectedDay(day);
    }

    useEffect(() => {
        if (!api) {
            return;
        }

        const handleSelect = (api: EmblaCarouselType) => {
            setTimeout(() => {
                setItems((prev) => {
                    if (api.selectedScrollSnap() > api.previousScrollSnap()) {
                        setCurrentMonth(prev[2]);
                        return [prev[1], prev[2], addMonths(prev[2], 1)];
                    } else {
                        setCurrentMonth(prev[0]);
                        return [subMonths(prev[0], 1), prev[0], prev[1]];
                    }
                });
            }, 700);
        };

        api.on("select", handleSelect);

        return () => {
            api.off("select", handleSelect);
        };
    }, [api]);

    useEffect(() => {
        if (!api) {
            return;
        }

        api.reInit({
            startIndex: 1,
        });
    }, [api, items]);

    return (
        <>
            <div>{format(currentMonth, "yyyy LLLL", { locale: ru })}</div>
            <DaysOfWeek />
            <div className="grid grid-cols-[30px_1fr]">
                <div className="flex flex-col justify-between gap-y-5 border-r-[1px] text-center">
                    {getWeeks(currentMonth).map((date) => (
                        <div
                            className={cn(
                                {
                                    "text-blue-500": isCurrentWeek(date),
                                },
                                "flex h-10 items-center justify-center",
                            )}
                        >
                            {date}
                        </div>
                    ))}
                </div>
                <Carousel
                    opts={{ startIndex: 1, watchResize: false }}
                    setApi={setApi}
                >
                    <CarouselContent>
                        {items.map((item, index) => (
                            <CarouselItem key={index}>
                                <div className="grid grid-cols-7 gap-x-1 gap-y-5">
                                    {getDates(item).map((day) => (
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
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </>
    );
}

export default App;
