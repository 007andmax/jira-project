import { BillableProfileTicketServiceExpenseItem } from './billable-profile-ticket-service-expense-item';
import { Tax } from 'src/class/taxes/tax';
import { TicketProfileService } from '../../../tickets/tickets/class/ticket-profile-service';

export class BillableProfileTicketServiceExpense extends TicketProfileService {
    ticketUpdate: any;
    taxes: Array<Tax>;
    isServiceContractSingleItem: boolean;
    sum: number;
    constructor(data = null) {
        super(data);
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
    public calculateQuantity() {
        let durationEnd = JSON.parse(JSON.stringify(this.durationEnd));
        if (this.durationStart - this.durationEnd > 0) durationEnd = this.durationEnd + 24 * 3600000;
        this.quantity = (durationEnd - this.durationStart) / 3600000 > 0 ? (durationEnd - this.durationStart) / 3600000 : 0;
        if (this.quantity > 24) this.quantity -= 24;
    }
}