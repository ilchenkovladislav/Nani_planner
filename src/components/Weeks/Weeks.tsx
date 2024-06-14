import { getISOWeeksOfMonth } from "@/lib/calendarUtils";
import { cn } from "@/lib/utils";
import { format, getWeeksInMonth, isThisWeek } from "date-fns";
import { Indicator } from "../Indicator/Indicator";
import { ru } from "date-fns/locale";
import { usePlans } from "@/hooks/usePlans";

type WeeksProps = {
    currentDate: Date;
    isMonthView: boolean;
};

export const Weeks = ({ currentDate, isMonthView }: WeeksProps) => {
    const ISOWeeks = isMonthView
        ? getISOWeeksOfMonth(currentDate)
        : [currentDate];

    const weeksInMonth = getWeeksInMonth(currentDate, { weekStartsOn: 1 });
    const gapClass = weeksInMonth === 6 ? "gap-y-2" : "gap-y-5";
    const { hasWeekPlan } = usePlans();

    return (
        <div className={cn("grid border-r border-gray-100 py-2", gapClass)}>
            {ISOWeeks.map((date) => (
                <div className="relative flex justify-center">
                    {hasWeekPlan(date) && <Indicator className="top-1" />}
                    <div
                        className={cn(
                            "grid h-10 items-center text-center text-xs text-gray-400",
                            {
                                "text-blue-500": isThisWeek(date),
                            },
                        )}
                        key={date.toString()}
                    >
                        {format(date, "I", { locale: ru })}
                    </div>
                </div>
            ))}
        </div>
    );
};
