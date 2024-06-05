import { useCurrentDateStore } from "@/store/currentDate";
import { useCalendarSpringStore } from "@/store/calendarSpring";
import { getWeeksInMonth } from "date-fns";
import { useEffect, useState, type PointerEvent } from "react";
import { useCalendarStore } from "@/store/calendar";

export function useCalendar() {
    const currentDate = useCurrentDateStore((state) => state.currentDate);
    const NUMBER_WEEKS = getWeeksInMonth(currentDate, { weekStartsOn: 1 }) - 1;
    const GAP = NUMBER_WEEKS === 4 ? 20 : 8;
    const ROW_HEIGHT = 40;
    const HEIGHT_WEEKS = (GAP + ROW_HEIGHT) * NUMBER_WEEKS;

    const [pointerStart, setPointerStart] = useState({ y: 0 });
    const [lastPosition, setLastPosition] = useState({
        y: 0,
    });

    const { styles, stylesApi, stylesBottomBlock, stylesBottomBlockApi } =
        useCalendarSpringStore((state) => state);

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

    function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
        setPointerStart({ y: e.clientY });
    }

    function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
        if (!isTransitioning) setIsTransitioning(true);

        const deltaY = lastPosition.y + e.clientY - pointerStart.y;

        if (deltaY <= -HEIGHT_WEEKS) {
            stylesApi.set({ y: -HEIGHT_WEEKS });
            return;
        }

        if (deltaY >= 0) {
            stylesApi.set({ y: 0 });
            return;
        }

        stylesApi.set({ y: deltaY });
        stylesBottomBlockApi.set({ y: deltaY });
    }

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

    function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
        setIsTransitioning(false);

        const deltaY = lastPosition.y + e.clientY - pointerStart.y;

        if (pointerStart.y - e.clientY === 0) return;

        setIsAnimating(true);
        if (pointerStart.y - e.clientY > 0) {
            if (deltaY <= -50) {
                closeCalendar(handleClose);
                setLastPosition((prev) => ({
                    ...prev,
                    y: -HEIGHT_WEEKS,
                }));
            } else {
                openCalendar(handleOpen);
                setLastPosition((prev) => ({ ...prev, y: 0 }));
            }
        } else {
            if (deltaY >= -HEIGHT_WEEKS + 50) {
                openCalendar(handleOpen);
                setLastPosition((prev) => ({ ...prev, y: 0 }));
            } else {
                closeCalendar(handleClose);
                setLastPosition((prev) => ({
                    ...prev,
                    y: -HEIGHT_WEEKS,
                }));
            }
        }
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
        handlers: {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
        },
        styles,
        stylesBottomBlock,
        isTransitioning,
        isAnimating,
        isOpened,
        shouldShowMonthView,
    };
}
