import { isCurrentWeek, getISOWeeksOfMonth } from "@/lib/calendarUtils";
import { cn } from "@/lib/utils";
import { getISOWeek } from "date-fns";

type WeeksProps = {
    currentDate: Date;
    isOpened: boolean;
};

export const Weeks = ({ currentDate, isOpened }: WeeksProps) => {
    const ISOWeeks = isOpened
        ? getISOWeeksOfMonth(currentDate)
        : [getISOWeek(currentDate)];

    return (
        <div className="flex flex-col justify-between gap-y-5 border-r-[1px] text-center">
            {ISOWeeks.map((date) => (
                <div
                    className={cn(
                        {
                            "text-blue-500": isCurrentWeek(date),
                        },
                        "flex h-10 items-center justify-center",
                    )}
                    key={date.toString()}
                >
                    {date}
                </div>
            ))}
        </div>
    );
};
