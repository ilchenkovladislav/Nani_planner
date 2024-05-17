import Dexie, { Table } from "dexie";

export interface Plan {
    id: string;
    editorJSON: string;
}

export class MySubClassedDexie extends Dexie {
    plans!: Table<Plan>;

    constructor() {
        super("nani_planner");
        this.version(1).stores({
            plans: "id", // Primary key and indexed props
        });
    }
}

export const db = new MySubClassedDexie();
