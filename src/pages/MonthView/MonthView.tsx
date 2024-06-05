import {
    addMonths,
    addWeeks,
    format,
    isSameISOWeek,
    isSameMonth,
    isToday,
    subMonths,
    subWeeks,
} from "date-fns";
import { ru } from "date-fns/locale";
import { MonthCalendar } from "@/components/MonthCalendar/MonthCalendar";
import { Link } from "@tanstack/react-router";
import { useSpring, animated } from "@react-spring/web";
import { useCurrentDateStore } from "@/store/currentDate";
import { FaListUl } from "react-icons/fa";
import { Indicator } from "@/components/Indicator/Indicator";
import { usePlans } from "@/hooks/usePlans";
import { TodayButton } from "@/components/TodayButton/TodayButton";
import { useCalendarCarousel } from "@/hooks/useCalendarCarousel";
import { useCalendarStore } from "@/store/calendar";

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

export function MonthView() {
    const currentDate = useCurrentDateStore((state) => state.currentDate);
    const updateCurrentDate = useCurrentDateStore(
        (state) => state.updateCurrentDate,
    );

    const [styles] = useSpring(() => ({
        from: { scale: 0, transformOrigin: variants[currentDate.getMonth()] },
        to: { scale: 1 },
    }));

    const { hasMonthPlan } = usePlans();
    const { next, prev } = useCalendarCarousel();
    const { isOpened } = useCalendarStore();

    function handleClickToday() {
        const today = new Date();

        if (isOpened) {
            if (isSameMonth(currentDate, today)) {
                updateCurrentDate(today);
                return;
            }

            const nextMonth = addMonths(currentDate, 1);
            if (isSameMonth(nextMonth, today)) {
                next(() => {
                    updateCurrentDate(today);
                });

                return;
            }

            const prevMonth = subMonths(currentDate, 1);
            if (isSameMonth(prevMonth, today)) {
                prev(() => {
                    updateCurrentDate(today);
                });

                return;
            }

            updateCurrentDate(today);
        } else {
            if (isSameISOWeek(currentDate, today)) {
                updateCurrentDate(today);
                return;
            }

            const nextWeek = addWeeks(currentDate, 1);
            if (isSameISOWeek(nextWeek, today)) {
                next(() => {
                    updateCurrentDate(today);
                });

                return;
            }

            const prevWeek = subWeeks(currentDate, 1);
            if (isSameISOWeek(prevWeek, today)) {
                prev(() => {
                    updateCurrentDate(today);
                });

                return;
            }

            updateCurrentDate(today);
        }
    }

    return (
        <>
            <div className="grid min-h-screen grid-rows-[min-content_1fr]">
                <div className="z-10 flex justify-between bg-background">
                    <div className="relative grid items-center">
                        <Link
                            to="/yearView"
                            search={{ month: `${currentDate.getMonth()}` }}
                            className="relative z-10 block bg-white"
                        >
                            <div>
                                {format(currentDate, "yyyy LLLL", {
                                    locale: ru,
                                })}
                            </div>
                        </Link>
                        {hasMonthPlan(currentDate) && (
                            <Indicator className="-right-3" />
                        )}
                    </div>
                    <Link to="/listView">
                        <FaListUl />
                    </Link>
                </div>

                <animated.div style={styles}>
                    <MonthCalendar />
                </animated.div>
            </div>
            <TodayButton
                className="fixed bottom-5 right-5 z-20"
                onClick={handleClickToday}
                show={!isToday(currentDate)}
            />
        </>
    );
}
