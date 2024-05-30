import { PlanType, db } from "@/db";
import { getWeek } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";

export function usePlans() {
    const plans = useLiveQuery(() => db.plans.toArray());

    function hasPlan(key: string, type: PlanType) {
        return plans?.find((plan) => plan.type === type && plan.key === key);
    }

    const hasDayPlan = useCallback(
        (date: Date) => {
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const type: PlanType = "day";

            return hasPlan(key, type);
        },
        [plans],
    );

    const hasWeekPlan = useCallback(
        (date: Date) => {
            const key = `${date.getFullYear()}-${getWeek(date)}`;
            const type: PlanType = "week";

            return hasPlan(key, type);
        },
        [plans],
    );

    const hasMonthPlan = useCallback(
        (date: Date) => {
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const type: PlanType = "month";

            return hasPlan(key, type);
        },
        [plans],
    );

    return { plans, hasDayPlan, hasWeekPlan, hasMonthPlan };
}
