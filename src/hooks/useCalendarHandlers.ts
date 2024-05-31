import { useCurrentDateStore } from "@/store/currentDate";
import { useCalendar } from "@/store/useCalendar";
import { getWeeksInMonth } from "date-fns";
import { useState, type PointerEvent } from "react";

export function useCalendarHandlers(
    onOpened?: () => void,
    onClosed?: () => void,
) {
    const currentDate = useCurrentDateStore((state) => state.currentDate);
    const NUMBER_WEEKS = getWeeksInMonth(currentDate, { weekStartsOn: 1 }) - 1;
    const [isOpened, setIsOpened] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const GAP = NUMBER_WEEKS === 4 ? 20 : 8;
    const ROW_HEIGHT = 40;
    const HEIGHT_WEEKS = (GAP + ROW_HEIGHT) * NUMBER_WEEKS;

    const [pointerStart, setPointerStart] = useState({ y: 0 });
    const [lastPosition, setLastPosition] = useState({
        y: 0,
    });

    const {
        styles,
        stylesApi,
        stylesBottomBlock,
        stylesBottomBlockApi,
        openCalendar,
        closeCalendar,
    } = useCalendar((state) => state);

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
        if (!onClosed) return;

        onClosed();
        setIsAnimating(false);
        setIsOpened(false);
    }

    function handleOpen() {
        if (!onOpened) return;

        onOpened();
        setIsAnimating(false);
        setIsOpened(true);
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
    };
}
