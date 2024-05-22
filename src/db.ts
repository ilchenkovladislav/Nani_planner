import Dexie, { Table } from "dexie";

export type PlanType = "day" | "week" | "month";

export interface Plan {
    id?: number;
    key: string;
    type: PlanType;
    date: string;
    editorJSON: string;
}

export class MySubClassedDexie extends Dexie {
    plans!: Table<Plan>;

    constructor() {
        super("nani_planner");
        this.version(1).stores({
            plans: "++id, key, type, date", // Primary key and indexed props
        });
    }
}

export const db = new MySubClassedDexie();
