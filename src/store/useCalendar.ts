import { Controller, SpringValue } from "@react-spring/web";
import { getWeeksInMonth } from "date-fns";
import { create } from "zustand";
import { useCurrentDateStore } from "./currentDate";

type calendarState = {
    styles: {
        y: SpringValue<number>;
    };
    stylesApi: Controller<{ y: number }>;
    stylesBottomBlock: {
        y: SpringValue<number>;
    };
    stylesBottomBlockApi: Controller<{ y: number }>;
    openCalendar(cb?: () => void): void;
    closeCalendar(cb?: () => void): void;
};

const currentDate = useCurrentDateStore.getState().currentDate;
const NUMBER_WEEKS = getWeeksInMonth(currentDate, { weekStartsOn: 1 }) - 1;

const GAP = NUMBER_WEEKS === 4 ? 20 : 8;
const ROW_HEIGHT = 40;
const HEIGHT_WEEKS = (GAP + ROW_HEIGHT) * NUMBER_WEEKS;

const stylesApi = new Controller<{ y: number }>({ y: 0 });
const styles = stylesApi.springs;

const stylesBottomBlockApi = new Controller<{ y: number }>({ y: 0 });
const stylesBottomBlock = stylesApi.springs;

function openCalendar(cb?: () => void) {
    stylesBottomBlockApi.start({
        to: {
            y: 0,
        },
        onResolve: () => {
            if (!cb) return;
            cb();
        },
    });
    stylesApi.start({
        to: {
            y: 0,
        },
    });
}

function closeCalendar(cb?: () => void) {
    stylesApi.start({
        to: {
            y: -HEIGHT_WEEKS,
        },
        onResolve: () => {
            if (!cb) return;

            setTimeout(() => {
                stylesApi.set({ y: 0 });
                cb();
            }, 0);
        },
    });

    stylesBottomBlockApi.start({
        to: {
            y: -HEIGHT_WEEKS,
        },
        onResolve: () => {
            setTimeout(() => {
                stylesBottomBlockApi.set({ y: 0 });
            }, 0);
        },
    });
}

export const useCalendar = create<calendarState>(() => ({
    styles,
    stylesApi,
    stylesBottomBlock,
    stylesBottomBlockApi,
    closeCalendar,
    openCalendar,
}));
