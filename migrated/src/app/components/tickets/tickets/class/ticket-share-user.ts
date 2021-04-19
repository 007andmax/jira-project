export class TicketShareUser {
    user: { id: string };
    constructor(data) {
        this.user = { id: data };
    }
}