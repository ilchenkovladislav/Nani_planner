import { Indicator } from "@/components/Indicator/Indicator";
import { usePlans } from "@/hooks/usePlans";
import { cn } from "@/lib/utils";
import {
    getISOWeek,
    isSameMonth,
    eachDayOfInterval,
    endOfISOWeek,
    endOfMonth,
    startOfISOWeek,
    startOfMonth,
    isToday,
} from "date-fns";

function getWeeks(year: number, month: number): number[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstWeek = getISOWeek(firstDay);
    const lastWeek = getISOWeek(lastDay);

    const weeks = Array.from(
        { length: (lastWeek < firstWeek ? 52 : lastWeek) - firstWeek + 1 },
        (_, i) => firstWeek + i,
    );

    if (lastWeek < firstWeek) {
        weeks.push(1);
    }

    return weeks;
}

export function getDates(year: number, month: number): Date[] {
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(monthStart);
    const start = startOfISOWeek(monthStart);
    const end = endOfISOWeek(monthEnd);

    return [...eachDayOfInterval({ start, end })];
}

type DayListProps = {
    month: number;
    year: number;
};

export function DayList(props: DayListProps) {
    const { year, month } = props;

    const { hasDayPlan, hasWeekPlanByYearView } = usePlans();

    return (
        <div>
            <div className="grid grid-cols-[1fr_min-content] gap-1">
                <div className="grid grid-cols-7 items-center justify-end gap-y-2 text-center text-[10px]">
                    {getDates(year, month).map((date, index) => {
                        if (!isSameMonth(date, new Date(year, month)))
                            return <div key={index} />;

                        const day = date.getDate();

                        return (
                            <div
                                key={date.toString()}
                                className="relative flex justify-center"
                            >
                                {hasDayPlan(date) && (
                                    <Indicator className="-top-1" />
                                )}
                                <div>{day}</div>
                            </div>
                        );
                    })}
                </div>
                <div className="grid items-center justify-center gap-1 gap-y-2 text-[10px] text-gray-400">
                    {getWeeks(year, month).map((weekNumber) => (
                        <div
                            className="relative flex justify-center"
                            key={weekNumber}
                        >
                            {hasWeekPlanByYearView(year, weekNumber) && (
                                <Indicator className="-top-1" />
                            )}
                            <div>{weekNumber}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
