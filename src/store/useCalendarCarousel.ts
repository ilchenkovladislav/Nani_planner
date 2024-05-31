import { create } from "zustand";
import { Controller, SpringValue } from "@react-spring/web";

type calendarState = {
    styles: {
        x: SpringValue<number>;
    };
    stylesApi: Controller<{ x: number }>;
    next: (cb?: () => void) => void;
    prev: (cb?: () => void) => void;
    cancel: () => void;
};

const CALENDAR_WIDTH = 100;

const stylesApi = new Controller<{ x: number }>({ x: -CALENDAR_WIDTH });
const styles = stylesApi.springs;

function next(cb?: () => void) {
    stylesApi.start({
        to: {
            x: -CALENDAR_WIDTH * 2,
        },
        onResolve: async () => {
            if (!cb) return;

            await new Promise<void>((resolve) => {
                cb();
                resolve();
            });
            setTimeout(() => {
                centeringCarousel();
            }, 0);
        },
    });
}

function cancel() {
    stylesApi.start({
        to: {
            x: -CALENDAR_WIDTH,
        },
    });
}

function prev(cb?: () => void) {
    stylesApi.start({
        to: {
            x: 0,
        },
        onResolve: async () => {
            if (!cb) return;

            await new Promise<void>((resolve) => {
                cb();
                resolve();
            });
            setTimeout(() => {
                centeringCarousel();
            }, 0);
        },
    });
}

function centeringCarousel() {
    stylesApi.set({
        x: -CALENDAR_WIDTH,
    });
}

export const useCalendarCarousel = create<calendarState>(() => ({
    styles,
    stylesApi,
    next,
    prev,
    cancel,
}));
