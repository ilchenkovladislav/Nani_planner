import { useCalendarStore } from "@/store/calendar";
import { CalendarCarousel } from "../CalendarCarousel/CalendarCarousel";
import { useCurrentDateStore } from "@/store/currentDate";
import { addWeeks, subWeeks } from "date-fns";
import { CalendarDay } from "../CalendarDay/CalendarDay";
import { Indicator } from "../Indicator/Indicator";
import { getWeekDates } from "@/lib/calendarUtils";
import { usePlans } from "@/hooks/usePlans";

export function WeekCalendar() {
    const slides = useCalendarStore((state) => state.slides);
    const currentDate = useCurrentDateStore((state) => state.currentDate);
    const updateCurrentDate = useCurrentDateStore(
        (state) => state.updateCurrentDate,
    );
    const { hasDayPlan } = usePlans();

    function handleNextSlide() {
        updateCurrentDate(addWeeks(currentDate, 1));
    }

    function handlePrevSlide() {
        updateCurrentDate(subWeeks(currentDate, 1));
    }

    function handleDayClick(day: Date) {
        updateCurrentDate(day);
    }

    return (
        <CalendarCarousel onNext={handleNextSlide} onPrev={handlePrevSlide}>
            {slides.map((slide) => (
                <div
                    key={`${slide.toISOString()}`}
                    className="grid grid-cols-7 gap-x-1 py-2"
                >
                    {getWeekDates(slide).map((day) => (
                        <div
                            key={day.toString()}
                            className="relative flex justify-center"
                        >
                            {hasDayPlan(day) && <Indicator className="top-1" />}
                            <CalendarDay
                                isOpened={false}
                                onDayClick={handleDayClick}
                                day={day}
                                currentDate={currentDate}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </CalendarCarousel>
    );
}
