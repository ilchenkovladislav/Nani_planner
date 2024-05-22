import { useEffect, useState, type PointerEvent } from "react";

import {
    subMonths,
    addMonths,
    subWeeks,
    addWeeks,
    getWeekOfMonth,
    getWeek,
    format,
    getWeeksInMonth,
} from "date-fns";

import { getDaysInMonthWithISOWeeks, getWeekDates } from "@/lib/calendarUtils";
import { DaysOfWeek } from "../DaysOfWeek/DaysOfWeek";
import { animated, useSpring } from "@react-spring/web";
import { Weeks } from "../Weeks/Weeks";
import "./MonthCalendar.css";
import { CalendarCarousel } from "../CalendarCarousel/CalendarCarousel";
import { CalendarDay } from "../CalendarDay/CalendarDay";
import { MyEditor } from "@/components/MyEditor/MyEditor";
import { useCurrentDateStore } from "@/store/currentDate";
import { PlanType, db } from "@/db";
import { useDebouncedCallback } from "use-debounce";
import { Editor, JSONContent } from "@tiptap/react";
import { useLiveQuery } from "dexie-react-hooks";
import { Indicator } from "../Indicator/Indicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";

const ROW_HEIGHT = 40;

type onUpdateProps = {
    editor: Editor;
};

export function MonthCalendar() {
    const currentDate = useCurrentDateStore((state) => state.currentDate);
    const updateCurrentDate = useCurrentDateStore(
        (state) => state.updateCurrentDate,
    );
    const NUMBER_ROWS = getWeekOfMonth(currentDate, { weekStartsOn: 1 }) - 1;
    const NUMBER_WEEKS = getWeeksInMonth(currentDate, { weekStartsOn: 1 }) - 1;

    const GAP = NUMBER_WEEKS === 4 ? 20 : 8;
    const HEIGHT_UP_SELECTED_WEEK = (GAP + ROW_HEIGHT) * NUMBER_ROWS;
    const HEIGHT_WEEKS = (GAP + ROW_HEIGHT) * NUMBER_WEEKS;

    const ratioY = HEIGHT_UP_SELECTED_WEEK / HEIGHT_WEEKS;

    const prevMonth = subMonths(currentDate, 1);
    const nextMonth = addMonths(currentDate, 1);

    const [items, setItems] = useState([prevMonth, currentDate, nextMonth]);
    const [isOpened, setIsOpened] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });
    const [lastPosition, setLastPosition] = useState({
        y: 0,
    });

    const [verticalCalendar, verticalCalendarApi] = useSpring(() => ({ y: 0 }));

    const [verticalBottomBlock, verticalBottomBlockApi] = useSpring(() => ({
        y: 0,
    }));

    const plans = useLiveQuery(() => db.plans.toArray());

    async function getContent(key: string): Promise<JSONContent | string> {
        try {
            const data = plans?.find((plan) => plan.key === key);

            if (data) {
                return JSON.parse(data.editorJSON);
            }
        } catch (err) {
            console.error(err);
        }
        return "";
    }

    async function getDayContent(): Promise<JSONContent | string> {
        const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
        return await getContent(key);
    }

    async function getWeekContent(): Promise<JSONContent | string> {
        const key = `${currentDate.getFullYear()}-${getWeek(currentDate)}`;
        return await getContent(key);
    }

    async function getMonthContent(): Promise<JSONContent | string> {
        const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
        return await getContent(key);
    }

    const [dayContent, setDayContent] = useState<JSONContent | string>("");
    const [weekContent, setWeekContent] = useState<JSONContent | string>("");
    const [monthContent, setMonthContent] = useState<JSONContent | string>("");

    useEffect(() => {
        getDayContent().then((data) => setDayContent(data));
        getWeekContent().then((data) => setWeekContent(data));
        getMonthContent().then((data) => setMonthContent(data));
    }, [currentDate]);

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

    const datesInMonth = (date: Date) =>
        shouldShowMonthView()
            ? getDaysInMonthWithISOWeeks(date)
            : getWeekDates(date);

    function setWeeklyItems() {
        const getWeeklyItems = (currentDate: Date): Date[] => [
            subWeeks(currentDate, 1),
            currentDate,
            addWeeks(currentDate, 1),
        ];
        const items = getWeeklyItems(currentDate);
        setItems(items);
    }

    function setMonthlyItems() {
        const getMonthlyItems = (currentDate: Date): Date[] => [
            prevMonth,
            currentDate,
            nextMonth,
        ];
        const items = getMonthlyItems(currentDate);
        setItems(items);
    }

    function closeCalendar() {
        setIsAnimating(true);
        switch (getWeekOfMonth(currentDate)) {
            case 1: {
                verticalBottomBlockApi.start({
                    to: {
                        y: -HEIGHT_WEEKS,
                    },
                    onResolve: () => {
                        setWeeklyItems();
                        setIsOpened(false);
                        setIsAnimating(false);

                        setTimeout(() => {
                            verticalBottomBlockApi.set({ y: 0 });
                        }, 0);
                    },
                });

                break;
            }
            case 2:
            case 3:
            case 4: {
                verticalBottomBlockApi.start({
                    to: {
                        y: -HEIGHT_WEEKS,
                    },
                    onResolve: () => {
                        setTimeout(() => {
                            verticalBottomBlockApi.set({ y: 0 });
                        }, 0);
                    },
                });
                verticalCalendarApi.start({
                    to: {
                        y: -HEIGHT_WEEKS,
                    },
                    onResolve: () => {
                        setIsAnimating(false);
                        setIsOpened(false);
                        setTimeout(() => {
                            verticalCalendarApi.set({ y: 0 });
                            setWeeklyItems();
                        }, 0);
                    },
                });

                break;
            }
            case 5: {
                verticalCalendarApi.start({
                    to: {
                        y: -HEIGHT_WEEKS,
                    },
                    onResolve: () => {
                        setIsAnimating(false);
                        setTimeout(() => {
                            setWeeklyItems();
                            setIsOpened(false);
                            verticalCalendarApi.set({ y: 0 });
                        }, 0);
                    },
                });
                verticalBottomBlockApi.start({
                    to: {
                        y: -HEIGHT_WEEKS,
                    },
                });

                break;
            }
            default:
                break;
        }
    }

    function openCalendar() {
        setIsAnimating(true);
        switch (getWeekOfMonth(currentDate)) {
            case 1: {
                verticalBottomBlockApi.start({
                    to: {
                        y: 0,
                    },
                    onStart: () => {
                        setIsOpened(true);
                    },
                    onResolve: () => {
                        setMonthlyItems();
                        setIsAnimating(false);
                        setTimeout(() => {
                            verticalCalendarApi.set({ y: 0 });
                        }, 0);
                    },
                });
                break;
            }
            case 2:
            case 3:
            case 4: {
                verticalBottomBlockApi.start({
                    to: {
                        y: 0,
                    },
                    onStart: () => {
                        setIsOpened(true);
                    },
                    onResolve: () => {
                        setMonthlyItems();
                        setIsAnimating(false);
                    },
                });
                verticalCalendarApi.start({
                    to: {
                        y: 0,
                    },
                });

                break;
            }
            case 5: {
                verticalCalendarApi.start({
                    to: {
                        y: 0,
                    },
                });
                verticalBottomBlockApi.start({
                    to: {
                        y: 0,
                    },
                    onStart: () => {
                        setIsOpened(true);
                    },
                    onResolve: () => {
                        setMonthlyItems();
                        setIsAnimating(false);
                    },
                });

                break;
            }
            default:
                break;
        }
    }

    function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
        setPointerStart({ x: e.clientX, y: e.clientY });
    }

    function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
        if (!isTransitioning) setIsTransitioning(true);

        const deltaY = lastPosition.y + e.clientY - pointerStart.y;

        if (deltaY <= -HEIGHT_WEEKS) {
            verticalCalendarApi.set({ y: -HEIGHT_WEEKS });
            return;
        }

        if (deltaY >= 0) {
            verticalCalendarApi.set({ y: 0 });
            return;
        }

        verticalCalendarApi.set({ y: deltaY });
        verticalBottomBlockApi.set({ y: deltaY });
    }

    function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
        setIsTransitioning(false);

        const deltaY = lastPosition.y + e.clientY - pointerStart.y;

        if (pointerStart.y - e.clientY === 0) return;

        if (pointerStart.y - e.clientY > 0) {
            if (deltaY <= -50) {
                closeCalendar();
                setLastPosition((prev) => ({
                    ...prev,
                    y: -HEIGHT_WEEKS,
                }));
            } else {
                openCalendar();
                setLastPosition((prev) => ({ ...prev, y: 0 }));
            }
        } else {
            if (deltaY >= -HEIGHT_WEEKS + 50) {
                openCalendar();
                setLastPosition((prev) => ({ ...prev, y: 0 }));
            } else {
                closeCalendar();
                setLastPosition((prev) => ({
                    ...prev,
                    y: -HEIGHT_WEEKS,
                }));
            }
        }
    }

    const setNextDates = () => {
        if (isOpened) {
            setItems((prev) => {
                return [prev[1], prev[2], addMonths(prev[2], 1)];
            });
        } else {
            setItems((prev) => {
                return [prev[1], prev[2], addWeeks(prev[2], 1)];
            });
        }
    };

    function handleNextSlide() {
        setNextDates();

        if (isOpened) {
            updateCurrentDate(addMonths(currentDate, 1));
        } else {
            updateCurrentDate(addWeeks(currentDate, 1));
        }
    }

    const setPrevDates = () => {
        if (isOpened) {
            setItems((prev) => {
                return [subMonths(prev[0], 1), prev[0], prev[1]];
            });
        } else {
            setItems((prev) => {
                return [subWeeks(prev[0], 1), prev[0], prev[1]];
            });
        }
    };

    function handlePrevSlide() {
        setPrevDates();

        if (isOpened) {
            updateCurrentDate(subMonths(currentDate, 1));
        } else {
            updateCurrentDate(subWeeks(currentDate, 1));
        }
    }

    function handleDayClick(day: Date) {
        updateCurrentDate(day);
    }

    const updatePlan = (key: string, type: PlanType, editor: Editor) => {
        if (editor.getText().trim().length === 0) {
            db.plans.delete(plans?.find((plan) => plan.key === key)?.id);
            return;
        }

        db.plans.put({
            key,
            type,
            date: currentDate.toISOString(),
            editorJSON: JSON.stringify(editor.getJSON()),
        });
    };

    const debouncedUpdateDay = useDebouncedCallback(
        ({ editor }: onUpdateProps) => {
            const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
            const type: PlanType = "day";
            updatePlan(key, type, editor);
        },
        1000,
    );

    const debouncedUpdateWeek = useDebouncedCallback(({ editor }) => {
        const key = `${currentDate.getFullYear()}-${getWeek(currentDate)}`;
        const type: PlanType = "week";
        updatePlan(key, type, editor);
    }, 1000);

    const debouncedUpdateMonth = useDebouncedCallback(
        ({ editor }: onUpdateProps) => {
            const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
            const type: PlanType = "month";
            updatePlan(key, type, editor);
        },
        1000,
    );

    function hasPlan(day: Date) {
        return plans?.find(
            (plan) =>
                plan.key ===
                `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`,
        );
    }

    const getGapClass = (date: Date) => {
        const weeksInMonth = getWeeksInMonth(date, { weekStartsOn: 1 });
        return weeksInMonth === 6 ? "gap-y-2" : "gap-y-5";
    };

    return (
        <div className="flex h-full flex-col ">
            <DaysOfWeek />
            <animated.div
                style={{
                    translateY: verticalCalendar.y.to((y) => `${y * ratioY}px`),
                    touchAction: "none",
                }}
            >
                <div className="grid grid-cols-[30px_1fr] items-start">
                    <Weeks
                        isMonthView={shouldShowMonthView()}
                        currentDate={currentDate}
                    />
                    <CalendarCarousel
                        onNext={handleNextSlide}
                        onPrev={handlePrevSlide}
                    >
                        {items.map((item) => (
                            <div
                                key={`${item.toISOString()}`}
                                className={cn(
                                    "grid grid-cols-7 gap-x-1",
                                    getGapClass(item),
                                )}
                            >
                                {datesInMonth(item).map((day) => (
                                    <div
                                        key={day.toString()}
                                        className="relative flex justify-center"
                                    >
                                        {hasPlan(day) && <Indicator />}
                                        <CalendarDay
                                            isOpened={isOpened}
                                            onDayClick={handleDayClick}
                                            day={day}
                                            currentDate={currentDate}
                                            setPrevDates={setPrevDates}
                                            setNextDates={setNextDates}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </CalendarCarousel>
                </div>
            </animated.div>
            <animated.div
                className="grid h-full border-t bg-background"
                style={{
                    translateY: verticalBottomBlock.y.to((y) => `${y}px`),
                    touchAction: "none",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <Tabs defaultValue="day" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="day">
                            День{" "}
                            {format(currentDate, "(d MMMM)", { locale: ru })}
                        </TabsTrigger>
                        <TabsTrigger value="week">
                            Неделя {format(currentDate, "(w)")}
                        </TabsTrigger>
                        <TabsTrigger value="month">
                            Месяц{" "}
                            {format(currentDate, "(LLLL)", { locale: ru })}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="day">
                        <MyEditor
                            onUpdate={debouncedUpdateDay}
                            content={dayContent}
                        />
                    </TabsContent>
                    <TabsContent value="week">
                        <MyEditor
                            onUpdate={debouncedUpdateWeek}
                            content={weekContent}
                        />
                    </TabsContent>
                    <TabsContent value="month">
                        <MyEditor
                            onUpdate={debouncedUpdateMonth}
                            content={monthContent}
                        />
                    </TabsContent>
                </Tabs>
            </animated.div>
        </div>
    );
}
