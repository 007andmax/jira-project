import { Task } from "./task";

export class CalendarMonth {
    date: Date;
    tasks: Array<Task> = [];
    inCurrentMonth: boolean;

    constructor(date: Date) {
        this.date = date;
    }
}