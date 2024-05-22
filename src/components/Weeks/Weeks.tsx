import { isCurrentWeek, getISOWeeksOfMonth } from "@/lib/calendarUtils";
import { cn } from "@/lib/utils";
import { getISOWeek, getWeeksInMonth } from "date-fns";

type WeeksProps = {
    currentDate: Date;
    isMonthView: boolean;
};

export const Weeks = ({ currentDate, isMonthView }: WeeksProps) => {
    const ISOWeeks = isMonthView
        ? getISOWeeksOfMonth(currentDate)
        : [getISOWeek(currentDate)];

    const weeksInMonth = getWeeksInMonth(currentDate, { weekStartsOn: 1 });
    const gapClass = weeksInMonth === 6 ? "gap-y-2" : "gap-y-5";

    return (
        <div className={cn("grid border-r-[1px]", gapClass)}>
            {ISOWeeks.map((date) => (
                <div
                    className={cn("grid h-10 items-center text-center", {
                        "text-blue-500": isCurrentWeek(date),
                    })}
                    key={date.toString()}
                >
                    {date}
                </div>
            ))}
        </div>
    );
};
