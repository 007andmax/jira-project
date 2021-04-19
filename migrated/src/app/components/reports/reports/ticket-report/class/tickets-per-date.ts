export class TicketsPerDate {
    date: string;
    ticketResolved: number;
    ticketUnresolved: number;
    constructor(data) {
        if (data) {
            this.date = data.date;
            this.ticketResolved = data.ticketResolved;
            this.ticketUnresolved = data.ticketUnresolved;
        }
    }
}