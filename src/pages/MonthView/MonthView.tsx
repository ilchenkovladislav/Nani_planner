import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MonthCalendar } from "@/components/MonthCalendar/MonthCalendar";
import { Link } from "@tanstack/react-router";
import { indexRoute } from "@/routes/routes";

export function MonthView() {
    const { year, month } = indexRoute.useParams();

    const [currentDate, setCurrentDate] = useState<Date>(
        new Date(Number(year), Number(month)),
    );

    function updateCurrentDate(month: Date) {
        setCurrentDate(month);
    }

    return (
        <>
            <Link
                to="/year/$year"
                params={{ year: `${currentDate.getFullYear()}` }}
                className="relative z-10 block bg-white"
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
