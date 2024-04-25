import {
    eachDayOfInterval,
    eachWeekOfInterval,
    endOfISOWeek,
    endOfMonth,
    endOfWeek,
    getISOWeek,
    startOfISOWeek,
    startOfMonth,
    startOfWeek,
} from "date-fns";

export function getISOWeeksOfMonth(date: Date): number[] {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

    const isoWeekNumbers = weeks.map((week) => getISOWeek(week));
    return isoWeekNumbers;
}

export function isCurrentWeek(week: number) {
    const today = new Date();
    return getISOWeek(today) === week;
}

export function getDaysInMonthWithISOWeeks(date: Date): Date[] {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(monthStart);
    const start = startOfISOWeek(monthStart);
    const end = endOfISOWeek(monthEnd);

    return [...eachDayOfInterval({ start, end })];
}

export function getWeekDates(date: Date): Date[] {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });

    const weekDates = eachDayOfInterval({ start, end });
    return weekDates;
}
