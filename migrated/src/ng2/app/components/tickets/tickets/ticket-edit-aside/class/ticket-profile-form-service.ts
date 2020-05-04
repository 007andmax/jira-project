import { Service } from 'src/ng2/app/interfaces/service/service';

export class TicketProfileFormService {
    completed: boolean = true;
    date: string = new Date().toISOString();
    description: string
    discountType: "PERCENT"
    durationEnd: number;
    durationStart: number;
    item: Service;
    itemOrder: number;
    quantity: number = 1;
    constructor() {
        this.durationStart = new Date().getTime();
        this.durationEnd = this.durationStart + 60000;
    }
    public setData(data, index) {
        this.item = data;
        this.itemOrder = index;

    }
    public setItemOrder(data) {
        this.itemOrder = data;
    }
    public setDescription(data) {
        this.description = data;
    }
    public setDate(data) {
        this.date = data;
    }
}