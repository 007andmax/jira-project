import { Task } from "./task";

export class CalendarWeek {
    date: Date;
    tasks: Array<Task> = [];
    constructor(date: Date) {
        this.date = new Date(date);
    }
}