import { useEffect, useState } from "react";
import { Calendar } from "./Calendar/Calendar";
import { CalendarCarousel } from "@/components/CalendarCarousel/CalendarCarousel";
import { useSpring, animated } from "@react-spring/web";
import { useCurrentDateStore } from "@/store/currentDate";

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
    const currentDate = useCurrentDateStore((state) => state.currentDate);
    const [items, setItems] = useState([
        currentDate.getFullYear() - 1,
        currentDate.getFullYear(),
        currentDate.getFullYear() + 1,
    ]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, []);

    const [styles] = useSpring(() => ({
        from: { scale: 2, transformOrigin: variants[currentDate.getMonth()] },
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
                {isLoading ? (
                    <>
                        <div />
                        <Calendar
                            year={currentDate.getFullYear()}
                            showDaysOfWeek
                        />
                        <div />
                    </>
                ) : (
                    items.map((year) => (
                        <Calendar key={year} year={year} showDaysOfWeek />
                    ))
                )}
            </CalendarCarousel>
        </animated.div>
    );
}
