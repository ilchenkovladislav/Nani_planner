import { useState } from "react";
import { Calendar } from "./Calendar/Calendar";
import { CalendarCarousel } from "@/components/CalendarCarousel/CalendarCarousel";
import { yearRoute } from "@/routes/routes";

export function YearView() {
    const { year } = yearRoute.useParams();
    const [items, setItems] = useState([
        Number(year) - 1,
        Number(year),
        Number(year) + 1,
    ]);

    function handleNextSlide() {
        setItems(items.map((year) => year + 1));
    }

    function handlePrevSlide() {
        setItems(items.map((year) => year - 1));
    }

    return (
        <CalendarCarousel
            onNext={handleNextSlide}
            onPrev={handlePrevSlide}
            widthContent={430}
        >
            {items.map((year) => (
                <Calendar key={year} year={year} showDaysOfWeek />
            ))}
        </CalendarCarousel>
    );
}
