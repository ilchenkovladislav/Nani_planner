import { useCurrentDateStore } from "@/store/currentDate";
import { getWeekOfMonth, getWeeksInMonth } from "date-fns";
import { useEffect } from "react";
import { useCalendarStore } from "@/store/calendar";
import { useDrag } from "@use-gesture/react";
import { useSpring } from "@react-spring/web";

export function useCalendar() {
    const currentDate = useCurrentDateStore((state) => state.currentDate);
    const NUMBER_WEEKS = getWeeksInMonth(currentDate, { weekStartsOn: 1 });
    const GAP = NUMBER_WEEKS - 1 === 4 ? 20 : 8;
    const ROW_HEIGHT = 40;
    const HEIGHT_WEEKS = (GAP + ROW_HEIGHT) * (NUMBER_WEEKS - 1);

    const NUMBER_ROWS = getWeekOfMonth(currentDate, { weekStartsOn: 1 });
    const PADDING_TOP = (GAP + ROW_HEIGHT) * (NUMBER_ROWS - 1);
    const PADDING_BOTTOM = (GAP + ROW_HEIGHT) * (NUMBER_WEEKS - NUMBER_ROWS);

    const [styles, stylesApi] = useSpring(() => ({
        y: 0,
        paddingTop: 0,
        paddingBottom: 0,
    }));

    const [stylesBottomBlock, stylesBottomBlockApi] = useSpring(() => ({
        y: 0,
    }));

    const {
        setMonthlyItems,
        setWeeklyItems,
        isOpened,
        isTransitioning,
        isAnimating,
        setIsOpened,
        setIsTransitioning,
        setIsAnimating,
        setMonth,
        setWeek,
    } = useCalendarStore();

    useEffect(() => {
        if (isOpened) {
            setMonth(currentDate);
        } else {
            setWeek(currentDate);
        }
    }, [currentDate]);

    const bind = useDrag(
        ({
            last,
            velocity: [, vy],
            offset: [, oy],
            direction: [, dy],
            cancel,
        }) => {
            if (last) {
                setIsTransitioning(false);
                setIsAnimating(true);
                if (dy > 0) {
                    openCalendar(handleOpen);
                    return;
                }

                if (oy > -100) {
                    cancel();
                    openCalendar(handleOpen);
                }

                if (oy < -100 || (vy > 0.5 && dy < 0)) {
                    closeCalendar(handleClose);
                }
            } else {
                if (!isTransitioning) setIsTransitioning(true);
                stylesApi.set({ paddingTop: 0, paddingBottom: 0 });

                stylesApi.start({ y: oy });
                stylesBottomBlockApi.start({ y: oy });
            }
        },
        {
            axis: "y",
            bounds: { top: -HEIGHT_WEEKS, bottom: 0 },
            from: () => [0, styles.y.get()],
        },
    );

    function handleClose() {
        setWeeklyItems();
        setIsAnimating(false);
        setIsOpened(false);
    }

    function handleOpen() {
        setMonthlyItems();
        setIsAnimating(false);
        setIsOpened(true);
    }

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
                    stylesApi.set({
                        paddingTop: PADDING_TOP,
                        paddingBottom: PADDING_BOTTOM,
                    });
                    cb();
                }, 0);
            },
        });

        stylesBottomBlockApi.start({
            to: {
                y: -HEIGHT_WEEKS,
            },
        });
    }

    function shouldShowMonthView() {
        // === При открытом календаре ===
        if (isOpened) {
            return true;
        }

        // === При закрытом календаре ===
        if (isAnimating) {
            return true;
        }

        if (isTransitioning) {
            return true;
        }
        return false;
    }

    return {
        styles,
        stylesBottomBlock,
        isTransitioning,
        isAnimating,
        isOpened,
        shouldShowMonthView,
        bind,
    };
}
