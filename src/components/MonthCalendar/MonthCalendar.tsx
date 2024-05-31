import { useEffect, useState } from "react";

import {
    subMonths,
    addMonths,
    subWeeks,
    addWeeks,
    getWeekOfMonth,
    getWeek,
    getWeeksInMonth,
} from "date-fns";

import { getDaysInMonthWithISOWeeks, getWeekDates } from "@/lib/calendarUtils";
import { DaysOfWeek } from "../DaysOfWeek/DaysOfWeek";
import { animated } from "@react-spring/web";
import { Weeks } from "../Weeks/Weeks";
import "./MonthCalendar.css";
import { CalendarCarousel } from "../CalendarCarousel/CalendarCarousel";
import { CalendarDay } from "../CalendarDay/CalendarDay";
import { MyEditor } from "@/components/MyEditor/MyEditor";
import { useCurrentDateStore } from "@/store/currentDate";
import { PlanType, db } from "@/db";
import { useDebouncedCallback } from "use-debounce";
import { Editor, JSONContent } from "@tiptap/react";
import { Indicator } from "../Indicator/Indicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { formatDay, formatMonth, formatWeekRange } from "@/utils/dateUtils";
import { usePlans } from "@/hooks/usePlans";
import { useCalendarHandlers } from "@/hooks/useCalendarHandlers";

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

    const {
        isOpened,
        isAnimating,
        isTransitioning,
        styles,
        stylesBottomBlock,
        handlers,
    } = useCalendarHandlers(setMonthlyItems, setWeeklyItems);

    const { plans, hasDayPlan } = usePlans();

    function getContent(key: string): JSONContent | string {
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

    function getDayContent(): JSONContent | string {
        const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
        return getContent(key);
    }

    function getWeekContent(): JSONContent | string {
        const key = `${currentDate.getFullYear()}-${getWeek(currentDate)}`;
        return getContent(key);
    }

    function getMonthContent(): JSONContent | string {
        const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
        return getContent(key);
    }

    const [dayContent, setDayContent] = useState<JSONContent | string>("");
    const [weekContent, setWeekContent] = useState<JSONContent | string>("");
    const [monthContent, setMonthContent] = useState<JSONContent | string>("");

    useEffect(() => {
        if (!plans) return;
        setDayContent(getDayContent());
        setWeekContent(getWeekContent());
        setMonthContent(getMonthContent());
    }, [currentDate, plans]);

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

    const getGapClass = (date: Date) => {
        const weeksInMonth = getWeeksInMonth(date, { weekStartsOn: 1 });
        return weeksInMonth === 6 ? "gap-y-2" : "gap-y-5";
    };

    return (
        <div className="flex h-full flex-col ">
            <DaysOfWeek />
            <animated.div
                style={{
                    translateY: styles.y.to((y) => `${y * ratioY}px`),
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
                                        {hasDayPlan(day) && (
                                            <Indicator className="top-1" />
                                        )}
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
                    translateY: stylesBottomBlock.y.to((y) => `${y}px`),
                    touchAction: "none",
                }}
                {...handlers}
            >
                <Tabs defaultValue="day" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="day">
                            День ({formatDay(currentDate)})
                        </TabsTrigger>
                        <TabsTrigger value="week">
                            Неделя ({formatWeekRange(currentDate)})
                        </TabsTrigger>
                        <TabsTrigger value="month">
                            Месяц ({formatMonth(currentDate)})
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
