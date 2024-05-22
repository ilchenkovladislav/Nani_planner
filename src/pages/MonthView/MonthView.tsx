import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MonthCalendar } from "@/components/MonthCalendar/MonthCalendar";
import { Link } from "@tanstack/react-router";
import { useSpring, animated } from "@react-spring/web";
import { useCurrentDateStore } from "@/store/currentDate";
import { FaListUl } from "react-icons/fa";

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
        <div className="grid min-h-screen grid-rows-[min-content_1fr]">
            <div className="z-10 flex justify-between bg-background">
                <Link
                    to="/yearView"
                    search={{ month: `${currentDate.getMonth()}` }}
                    className="relative z-10 block bg-white"
                >
                    <div>
                        {format(currentDate, "yyyy LLLL", { locale: ru })}
                    </div>
                </Link>
                <Link to="/listView">
                    <FaListUl />
                </Link>
            </div>

            <animated.div style={styles}>
                <MonthCalendar />
            </animated.div>
        </div>
    );
}
