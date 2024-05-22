import { db } from "@/db";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useLiveQuery } from "dexie-react-hooks";

import { Link } from "@tanstack/react-router";
import { FaListUl } from "react-icons/fa";
import { getContentByType } from "@/utils/getContentByType";

export function ReversedView() {
    const plans = useLiveQuery(() => db.plans.reverse().toArray());

    if (!plans) return null;

    return (
        <div>
            <Link to="/listView">
                <FaListUl />
            </Link>
            <div className="grid gap-5 p-5">
                {plans.map((plan) => (
                    <div key={plan.id}>
                        <h2 className="font-semibold">
                            {format(plan.date, "yyyy LLLL", { locale: ru })}
                        </h2>
                        <div className="grid gap-5">
                            <div className="rounded-md border p-5">
                                {getContentByType(plan)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
