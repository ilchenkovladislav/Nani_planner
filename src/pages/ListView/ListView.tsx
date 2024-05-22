import { Plan, db } from "@/db";
import {
    endOfISOWeek,
    endOfMonth,
    format,
    parse,
    startOfISOWeek,
    startOfMonth,
} from "date-fns";
import { ru } from "date-fns/locale";
import { useLiveQuery } from "dexie-react-hooks";
import { generateText } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import { Link } from "@tanstack/react-router";
import { FaListUl } from "react-icons/fa";

export function ListView() {
    const plans = useLiveQuery(() => db.plans.toArray());

    // Функция для сортировки и группировки данных
    const sortAndGroupData = (data: Plan[] = []) => {
        if (!data) return;

        // Сортировка данных по дате
        const sortedData = data.sort(
            (a, b) => new Date(a.date) - new Date(b.date),
        );

        // Группировка данных по месяцам и годам
        const groupedData = sortedData.reduce((acc, item) => {
            const date = new Date(item.date);
            const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

            if (!acc[yearMonth]) {
                acc[yearMonth] = [];
            }

            acc[yearMonth].push(item);
            return acc;
        }, {});

        // Сортировка данных внутри каждой группы по типу
        for (const key in groupedData) {
            groupedData[key] = groupedData[key].sort((a, b) => {
                const typeOrder = { day: 1, week: 2, month: 3 };
                return typeOrder[a.type] - typeOrder[b.type];
            });
        }

        return groupedData;
    };

    const groupedData = sortAndGroupData(plans);

    function jsonToText(json: string) {
        return generateText(
            JSON.parse(json),
            [Document, Paragraph, Bold, Italic, Text, TaskList, TaskItem],
            {
                blockSeparator: " ",
            },
        ).trim();
    }

    function getContentByType(plan: Plan) {
        switch (plan.type) {
            case "day":
                return (
                    <div className="grid grid-cols-[35px_1fr] items-center gap-x-3">
                        <div className="grid text-center">
                            <span className="self-end text-lg font-semibold">
                                {format(new Date(plan.date), "dd", {
                                    locale: ru,
                                })}
                            </span>
                            <span>
                                {format(new Date(plan.date), "iiiiii", {
                                    locale: ru,
                                })}
                            </span>
                        </div>
                        <pre className="text-wrap">
                            {jsonToText(plan.editorJSON)}
                        </pre>
                    </div>
                );
            case "week": {
                const start = startOfISOWeek(new Date(plan.date));
                const end = endOfISOWeek(new Date(plan.date));

                return (
                    <div className="grid grid-cols-[35px_1fr] items-center gap-5">
                        <div className="text-center">
                            <div className="grid text-center">
                                <span className="text-lg font-semibold">
                                    {format(start, "dd", { locale: ru })}
                                </span>
                                <span>
                                    {format(start, "MMM", { locale: ru })}
                                </span>
                            </div>
                            —
                            <div className="grid text-center">
                                <span className="text-lg font-semibold">
                                    {format(end, "dd", { locale: ru })}
                                </span>
                                <span>
                                    {format(end, "MMM", { locale: ru })}
                                </span>
                            </div>
                        </div>
                        <pre className="text-wrap">
                            {jsonToText(plan.editorJSON)}
                        </pre>
                    </div>
                );
            }
            case "month": {
                const start = startOfMonth(new Date(plan.date));
                const end = endOfMonth(new Date(plan.date));

                return (
                    <div className="grid grid-cols-[35px_1fr] items-center gap-5">
                        <div className="text-center">
                            <div className="grid text-center">
                                <span className="text-lg font-semibold">
                                    {format(start, "dd", { locale: ru })}
                                </span>
                                <span>
                                    {format(start, "MMM", { locale: ru })}
                                </span>
                            </div>
                            —
                            <div className="grid text-center">
                                <span className="text-lg font-semibold">
                                    {format(end, "dd", { locale: ru })}
                                </span>
                                <span>
                                    {format(end, "MMM", { locale: ru })}
                                </span>
                            </div>
                        </div>
                        <pre className="text-wrap">
                            {jsonToText(plan.editorJSON)}
                        </pre>
                    </div>
                );
            }
        }
    }

    return groupedData ? (
        <div>
            <Link to="/reversedView">
                <FaListUl />
            </Link>
            <div className="grid gap-5 p-5">
                {Object.keys(groupedData).map((yearMonth) => (
                    <div key={yearMonth}>
                        <h2 className="font-semibold">
                            {format(
                                parse(yearMonth, "yyyy-MM", new Date()),
                                "yyyy LLLL",
                                { locale: ru },
                            )}
                        </h2>
                        <div className="grid gap-5">
                            {groupedData[yearMonth].map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-md border p-5"
                                >
                                    {getContentByType(item)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : null;
}
