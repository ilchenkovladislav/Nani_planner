import { Plan, PlanType, db } from "@/db";
import { useCurrentDateStore } from "@/store/currentDate";
import { getWeek } from "date-fns";
import { useCallback, useEffect, useState } from "react";

export function usePlans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const currentDate = useCurrentDateStore((state) => state.currentDate);

    useEffect(() => {
        db.plans.toArray().then((plans) => {
            setPlans(plans);
        });
    }, [currentDate]);

    function hasPlan(key: string, type: PlanType): boolean {
        return !!plans?.find((plan) => plan.type === type && plan.key === key);
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

    const hasWeekPlanByYearView = useCallback(
        (year: number, week: number) => {
            const key = `${year}-${week}`;
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

    return {
        plans,
        hasDayPlan,
        hasWeekPlan,
        hasMonthPlan,
        hasWeekPlanByYearView,
    };
}
