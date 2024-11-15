export class TechTicketItem {
    closed: number;
    claimed: number;
    fullName: string;

    constructor(data) {
        this.closed = data.closed;
        this.claimed = data.claimed;
        this.fullName = data.fullName;

    }
}