import { endOfISOWeek, format, startOfISOWeek } from "date-fns";
import { ru } from "date-fns/locale";

export const formatDay = (date: Date) => format(date, "d MMM", { locale: ru });

export const formatMonth = (date: Date) => format(date, "LLL", { locale: ru });

export function formatWeekRange(date: Date) {
    return `${format(startOfISOWeek(date), "d")} - ${format(
        endOfISOWeek(date),
        "d MMM",
        {
            locale: ru,
        },
    )}`;
}
