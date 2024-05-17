import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MonthCalendar } from "@/components/MonthCalendar/MonthCalendar";
import { Link } from "@tanstack/react-router";
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

export function MonthView() {
    const currentDate = useCurrentDateStore((state) => state.currentDate);

    const [styles] = useSpring(() => ({
        from: { scale: 0, transformOrigin: variants[currentDate.getMonth()] },
        to: { scale: 1 },
    }));

    return (
        <>
            <Link
                to="/yearView"
                search={{ month: `${currentDate.getMonth()}` }}
                className="relative z-10 block bg-white"
            >
                <div>{format(currentDate, "yyyy LLLL", { locale: ru })}</div>
            </Link>

            <animated.div style={styles}>
                <MonthCalendar />
            </animated.div>
        </>
    );
}
