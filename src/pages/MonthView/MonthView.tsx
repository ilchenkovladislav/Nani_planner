import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MonthCalendar } from "@/components/MonthCalendar/MonthCalendar";
import { Link } from "@tanstack/react-router";
import { indexRoute } from "@/routes/routes";

export function MonthView() {
    const { year, month } = indexRoute.useParams();
    const date = new Date();
    date.setFullYear(Number(year));
    date.setMonth(Number(month));
    const [currentDate, setCurrentDate] = useState<Date>(date);

    function updateCurrentDate(month: Date) {
        setCurrentDate(month);
    }

    return (
        <>
            <Link
                to="/year/$year"
                params={{ year: `${currentDate.getFullYear()}` }}
                className="relative z-10 bg-white"
            >
                <div>{format(currentDate, "yyyy LLLL", { locale: ru })}</div>
            </Link>
            {
                <MonthCalendar
                    currentDate={currentDate}
                    onUpdateCurrentDate={updateCurrentDate}
                />
            }
        </>
    );
}
