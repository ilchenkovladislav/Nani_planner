import { useState } from "react";
import { Calendar } from "./Calendar/Calendar";
import { CalendarCarousel } from "@/components/CalendarCarousel/CalendarCarousel";
import { yearRoute } from "@/routes/routes";
import { useSpring, animated } from "@react-spring/web";
import { useSearch } from "@tanstack/react-router";

const variants = [
    "top left",
    "top",
    "top right",
    "left",
    "center",
    "right",
    "left bottom",
    "bottom",
    "right bottom",
    "left bottom",
    "bottom",
    "right bottom",
];

export function YearView() {
    const { year } = yearRoute.useParams();
    const { month } = useSearch({ strict: false });

    const [items, setItems] = useState([
        Number(year) - 1,
        Number(year),
        Number(year) + 1,
    ]);

    const [styles] = useSpring(() => ({
        from: { scale: 2, transformOrigin: variants[Number(month)] },
        to: { scale: 1 },
    }));

    function handleNextSlide() {
        setItems(items.map((year) => year + 1));
    }

    function handlePrevSlide() {
        setItems(items.map((year) => year - 1));
    }

    return (
        <animated.div style={styles}>
            <CalendarCarousel onNext={handleNextSlide} onPrev={handlePrevSlide}>
                {items.map((year) => (
                    <Calendar key={year} year={year} showDaysOfWeek />
                ))}
            </CalendarCarousel>
        </animated.div>
    );
}
