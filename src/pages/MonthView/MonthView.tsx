import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MonthCalendar } from "@/components/MonthCalendar/MonthCalendar";
import { Link } from "@tanstack/react-router";
import { indexRoute } from "@/routes/routes";
import { useSpring, animated } from "@react-spring/web";

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
    const { year, month } = indexRoute.useParams();
    const [currentDate, setCurrentDate] = useState<Date>(
        new Date(Number(year), Number(month)),
    );

    const [styles] = useSpring(() => ({
        from: { scale: 0, transformOrigin: variants[Number(month)] },
        to: { scale: 1 },
    }));

    function updateCurrentDate(month: Date) {
        setCurrentDate(month);
    }

    return (
        <>
            <Link
                to="/year/$year"
                params={{ year: `${currentDate.getFullYear()}` }}
                search={{ month: `${currentDate.getMonth()}` }}
                className="relative z-10 block bg-white"
            >
                <div>{format(currentDate, "yyyy LLLL", { locale: ru })}</div>
            </Link>

            <animated.div style={styles}>
                <MonthCalendar
                    currentDate={currentDate}
                    onUpdateCurrentDate={updateCurrentDate}
                />
            </animated.div>
        </>
    );
}
