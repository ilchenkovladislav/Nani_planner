import { Link } from "@tanstack/react-router";
import { DaysOfWeek } from "../DaysOfWeek/DaysOfWeek";
import { DayList } from "../DayList/DayList";
import { useCurrentDateStore } from "@/store/currentDate";
import { Indicator } from "@/components/Indicator/Indicator";
import { usePlans } from "@/hooks/usePlans";

type CalendarMonthProps = {
    month: string;
    year: number;
    index: number;
    showDaysOfWeek?: boolean;
};

export function CalendarMonth(props: CalendarMonthProps) {
    const { month, index, year, showDaysOfWeek } = props;
    const currentDate = useCurrentDateStore((state) => state.currentDate);
    const updateCurrentDate = useCurrentDateStore(
        (state) => state.updateCurrentDate,
    );
    const { hasMonthPlan } = usePlans();

    return (
        <div key={month} className="relative grid gap-1">
            <div className="relative grid w-max items-center">
                <h3 className="w-max text-sm">{month}</h3>
                {hasMonthPlan(new Date(year, index)) && (
                    <Indicator className="-right-3" />
                )}
            </div>
            <DaysOfWeek show={showDaysOfWeek} />
            <DayList year={year} month={index} />

            <Link
                to="/monthView"
                onClick={() =>
                    updateCurrentDate(
                        new Date(year, index, currentDate.getDate()),
                    )
                }
                className="absolute inset-0"
            />
        </div>
    );
}
