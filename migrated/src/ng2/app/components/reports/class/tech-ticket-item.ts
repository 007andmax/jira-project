export class TechTicketItem {
    closed: number;
    created: number;
    fullName: string;

    constructor(data) {
        this.closed = data.closed;
        this.created = data.created;
        this.fullName = data.fullName;

    }
}