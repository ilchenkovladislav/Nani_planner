import { create } from "zustand";

type CurrentDateState = {
    currentDate: Date;
    updateCurrentDate: (date: Date) => void;
};

export const useCurrentDateStore = create<CurrentDateState>((set) => ({
    currentDate: new Date(),
    updateCurrentDate: (date) => set({ currentDate: date }),
}));
