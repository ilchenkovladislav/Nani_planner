import { CalendarMonth } from "../CalendarMonth/CalendarMonth";

export const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
] as const;

type CalendarProps = {
    year: number;
    showDaysOfWeek?: boolean;
};

export function Calendar({ year, showDaysOfWeek }: CalendarProps) {
    return (
        <div className="px-5">
            <h2>{year}</h2>
            <div className="grid grid-cols-3 gap-3">
                {months.map((month, index) => (
                    <CalendarMonth
                        month={month}
                        year={year}
                        index={index}
                        showDaysOfWeek={showDaysOfWeek}
                        key={month}
                    />
                ))}
            </div>
        </div>
    );
}
