import { addMonths, addWeeks, subMonths, subWeeks } from "date-fns";
import { create } from "zustand";

type calendarState = {
    slides: [Date, Date, Date];
    setNextMonth: () => void;
    setNextWeek: () => void;
    setPrevMonth: () => void;
    setPrevWeek: () => void;
    setMonthlyItems: () => void;
    setWeeklyItems: () => void;
};

const currentDate = new Date();
const prevMonth = subMonths(currentDate, 1);
const nextMonth = addMonths(currentDate, 1);

export const useCalendarStore = create<calendarState>((set) => ({
    slides: [prevMonth, currentDate, nextMonth],
    setNextMonth: () =>
        set((state) => ({
            slides: [
                state.slides[1],
                state.slides[2],
                addMonths(state.slides[2], 1),
            ],
        })),
    setNextWeek: () =>
        set((state) => ({
            slides: [
                state.slides[1],
                state.slides[2],
                addWeeks(state.slides[2], 1),
            ],
        })),

    setPrevMonth: () =>
        set((state) => ({
            slides: [
                subMonths(state.slides[0], 1),
                state.slides[0],
                state.slides[1],
            ],
        })),
    setPrevWeek: () =>
        set((state) => ({
            slides: [
                subWeeks(state.slides[0], 1),
                state.slides[0],
                state.slides[1],
            ],
        })),
    setMonthlyItems: () =>
        set((state) => {
            return {
                slides: [
                    subMonths(state.slides[1], 1),
                    state.slides[1],
                    addMonths(state.slides[1], 1),
                ],
            };
        }),

    setWeeklyItems: () =>
        set((state) => {
            return {
                slides: [
                    subWeeks(state.slides[1], 1),
                    state.slides[1],
                    addWeeks(state.slides[1], 1),
                ],
            };
        }),
}));
