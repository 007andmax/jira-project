export class DashboardTicketsChartData {
    date: string;
    totalTickets: number;
    constructor(data) {
        this.date = data.date;
        this.totalTickets = data.totalTickets;
    }
}