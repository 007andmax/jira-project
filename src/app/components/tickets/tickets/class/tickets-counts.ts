export class TicketsCounts {
    ALL: number;
    CLOSED: number;
    ON_HOLD: number;
    OPEN: number;
    RECURRING_TICKETS_CLOSED: number;
    RECURRING_TICKETS_OPEN: number;
    SPAM: number;
    TRASH: number;
    UNASSIGNED: number;;
    USER: number;
    constructor(data) {
        this.ALL = data.ALL;
        this.CLOSED = data.CLOSED;
        this.ON_HOLD = data.ON_HOLD;
        this.OPEN = data.OPEN;
        this.RECURRING_TICKETS_CLOSED = data.RECURRING_TICKETS_CLOSED;
        this.RECURRING_TICKETS_OPEN = data.RECURRING_TICKETS_OPEN;
        this.SPAM = data.SPAM;
        this.TRASH = data.TRASH;
        this.UNASSIGNED = data.UNASSIGNED;
        this.USER = data.USER;
    }
}