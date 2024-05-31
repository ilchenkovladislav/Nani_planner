import { cn } from "@/lib/utils";
import { useCalendarCarousel } from "@/store/useCalendarCarousel";
import { isToday, format, isSameDay, isSameMonth, addMonths } from "date-fns";

type CalendarDay = {
    day: Date;
    onDayClick: (day: Date) => void;
    currentDate: Date;
    isOpened: boolean;
    setNextDates: () => void;
    setPrevDates: () => void;
};

export function CalendarDay({
    day,
    onDayClick,
    currentDate,
    isOpened,
    setNextDates,
    setPrevDates,
}: CalendarDay) {
    const next = useCalendarCarousel((state) => state.next);
    const prev = useCalendarCarousel((state) => state.prev);

    function handleNext() {
        setNextDates();
        onDayClick(day);
    }

    function handlePrev() {
        setPrevDates();
        onDayClick(day);
    }

    function dayClickHandle(day: Date) {
        if (isSameMonth(currentDate, day) || !isOpened) {
            onDayClick(day);
            return;
        }

        if (isSameMonth(addMonths(currentDate, 1), day)) {
            if (!next) return;
            next(handleNext);
        } else {
            if (!prev) return;
            prev(handlePrev);
        }
    }

    return (
        <div
            className={cn(
                {
                    "rounded-full border": isSameDay(day, currentDate),
                    "text-blue-500": isToday(day),
                    "text-gray-400": isOpened && !isSameMonth(currentDate, day),
                },
                "flex size-10 items-center justify-center text-lg",
            )}
            onClick={() => dayClickHandle(day)}
        >
            {format(day, "d")}
        </div>
    );
}
