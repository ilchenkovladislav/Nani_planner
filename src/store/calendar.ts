import { addMonths, addWeeks, subMonths, subWeeks } from "date-fns";
import { create } from "zustand";

type calendarState = {
    slides: [Date, Date, Date];
    isOpened: boolean;
    isTransitioning: boolean;
    isAnimating: boolean;
    setIsOpened: (isOpened: boolean) => void;
    setIsTransitioning: (isTransitioning: boolean) => void;
    setIsAnimating: (isAnimating: boolean) => void;
    setNextMonth: () => void;
    setNextWeek: () => void;
    setPrevMonth: () => void;
    setPrevWeek: () => void;
    setMonth: (date: Date) => void;
    setWeek: (date: Date) => void;
    setMonthlyItems: () => void;
    setWeeklyItems: () => void;
};

const currentDate = new Date();
const prevMonth = subMonths(currentDate, 1);
const nextMonth = addMonths(currentDate, 1);

export const useCalendarStore = create<calendarState>((set) => ({
    slides: [prevMonth, currentDate, nextMonth],
    isOpened: true,
    isTransitioning: false,
    isAnimating: false,
    setIsOpened: (isOpened) => set({ isOpened }),
    setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
    setIsAnimating: (isAnimating) => set({ isAnimating }),
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

    setMonth: (date: Date) =>
        set({
            slides: [subMonths(date, 1), date, addMonths(date, 1)],
        }),

    setWeek: (date: Date) =>
        set({
            slides: [subWeeks(date, 1), date, addWeeks(date, 1)],
        }),

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
