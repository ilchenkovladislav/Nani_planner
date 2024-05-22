import { Plan } from "@/db";
import { jsonToText } from "@/utils/jsonToText";
import {
    endOfISOWeek,
    endOfMonth,
    format,
    startOfISOWeek,
    startOfMonth,
} from "date-fns";
import { ru } from "date-fns/locale";

export function getContentByType(plan: Plan) {
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
                            <span>{format(start, "MMM", { locale: ru })}</span>
                        </div>
                        —
                        <div className="grid text-center">
                            <span className="text-lg font-semibold">
                                {format(end, "dd", { locale: ru })}
                            </span>
                            <span>{format(end, "MMM", { locale: ru })}</span>
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
                            <span>{format(start, "MMM", { locale: ru })}</span>
                        </div>
                        —
                        <div className="grid text-center">
                            <span className="text-lg font-semibold">
                                {format(end, "dd", { locale: ru })}
                            </span>
                            <span>{format(end, "MMM", { locale: ru })}</span>
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
