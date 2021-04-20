import { CurrentUser } from 'src/class/current-user/current-user';

export class TicketProfileShare {
    date: number;
    id: string;
    itemOrder: number;
    user: CurrentUser;
    constructor(data) {
        this.date = data.date;
        this.id = data.id;
        this.itemOrder = data.itemOrder;
        this.user = new CurrentUser(data.user);

    }
}