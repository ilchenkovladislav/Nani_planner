import { Link } from "@tanstack/react-router";
import { DaysOfWeek } from "../DaysOfWeek/DaysOfWeek";
import { DayList } from "../DayList/DayList";

type CalendarMonthProps = {
    month: string;
    year: number;
    index: number;
    showDaysOfWeek?: boolean;
};

export function CalendarMonth(props: CalendarMonthProps) {
    const { month, index, year, showDaysOfWeek } = props;

    return (
        <div key={month} className="relative grid gap-1">
            <h3 className="text-sm">{month}</h3>
            <DaysOfWeek show={showDaysOfWeek} />
            <DayList year={year} month={index} />

            <Link
                to="/$year/$month"
                params={{ year: `${year}`, month: `${index}` }}
                className="absolute inset-0"
            />
        </div>
    );
}
