export class DashboardTicketsChartData {
    date: string;
    totalTickets: number;
    completedTickets: number;
    onHoldTickets: number;

    constructor(data) {
        this.date = data.date;
        this.totalTickets = data.totalTickets;
        this.completedTickets = data.completedTickets;
        this.onHoldTickets = data.completedTickets;
    }
}