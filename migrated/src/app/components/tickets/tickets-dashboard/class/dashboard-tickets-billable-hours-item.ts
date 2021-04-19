export class DashboardTicketsBillableHoursItem {
    title: string;
    value: number;
    percent: number;
    constructor(title, value, percent) {
        this.title = title;
        this.value = value;
        this.percent = percent;
    }
}