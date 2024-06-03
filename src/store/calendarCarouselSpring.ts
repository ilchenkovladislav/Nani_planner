import { create } from "zustand";
import { Controller, SpringValue } from "@react-spring/web";

type calendarState = {
    styles: {
        x: SpringValue<number>;
    };
    stylesApi: Controller<{ x: number }>;
};

const CALENDAR_WIDTH = 100;

const stylesApi = new Controller<{ x: number }>({ x: -CALENDAR_WIDTH });
const styles = stylesApi.springs;

export const useCalendarCarouselSpringStore = create<calendarState>(() => ({
    styles,
    stylesApi,
}));
