import { TicketsReportItemExpenses } from './tickets-report-item-expenses';

export class TicketsReportItemUpdate {
    note: any;
    type: string;
    customerReportTicketId: string;
    expenses: Array<TicketsReportItemExpenses>;
    constructor(data) {
        if (data) {
            this.note = data.note;
            this.type = data.type;
            this.customerReportTicketId = data.customerReportTicketId;
            this.expenses = (data.expenses) ? data.expenses.map(element => {
                return new TicketsReportItemExpenses(element);
            }) : [];
        }
    }
}