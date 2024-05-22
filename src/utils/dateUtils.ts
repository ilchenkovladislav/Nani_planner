import { endOfISOWeek, format, startOfISOWeek } from "date-fns";
import { ru } from "date-fns/locale";

export const formatDay = (date: Date) => format(date, "d MMMM", { locale: ru });

export const formatMonth = (date: Date) => format(date, "LLLL", { locale: ru });

export function formatWeekRange(date: Date) {
    return `${format(startOfISOWeek(date), "d")} - ${format(
        endOfISOWeek(date),
        "d MMMM",
        {
            locale: ru,
        },
    )}`;
}
