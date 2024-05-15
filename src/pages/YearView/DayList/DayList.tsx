import {
    getISOWeek,
    isSameMonth,
    format,
    eachDayOfInterval,
    endOfISOWeek,
    endOfMonth,
    startOfISOWeek,
    startOfMonth,
} from "date-fns";

function getWeeks(year: number, month: number): number[] {
    const weeks = new Set<number>();
    const date = new Date(year, month);
    while (date.getMonth() === month) {
        const weekNumber = getISOWeek(date);
        weeks.add(weekNumber);
        date.setDate(date.getDate() + 1);
    }
    return [...weeks];
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

    return (
        <div>
            <div className="grid grid-cols-[1fr_min-content] gap-1">
                <div className="grid grid-cols-7 items-center justify-end gap-y-2 text-center text-[10px]">
                    {getDates(year, month).map((date, index) => {
                        if (!isSameMonth(date, new Date(year, month)))
                            return <div key={index} />;

                        const day = format(date, "d");

                        return <div key={date.toString()}>{day}</div>;
                    })}
                </div>
                <div className="grid items-center justify-center gap-1 gap-y-2 text-[10px] text-gray-400">
                    {getWeeks(year, month).map((weekNumber) => (
                        <div key={weekNumber}>{weekNumber}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
