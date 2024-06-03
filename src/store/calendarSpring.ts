import { Controller, SpringValue } from "@react-spring/web";
import { create } from "zustand";

type calendarState = {
    styles: {
        y: SpringValue<number>;
    };
    stylesApi: Controller<{ y: number }>;
    stylesBottomBlock: {
        y: SpringValue<number>;
    };
    stylesBottomBlockApi: Controller<{ y: number }>;
};

const stylesApi = new Controller<{ y: number }>({ y: 0 });
const styles = stylesApi.springs;

const stylesBottomBlockApi = new Controller<{ y: number }>({ y: 0 });
const stylesBottomBlock = stylesApi.springs;

export const useCalendarSpringStore = create<calendarState>(() => ({
    styles,
    stylesApi,
    stylesBottomBlock,
    stylesBottomBlockApi,
}));
