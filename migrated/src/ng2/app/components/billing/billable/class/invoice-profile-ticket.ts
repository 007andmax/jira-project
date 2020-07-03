import { BillableProfileTicketProductExpense } from './billable-profile-ticket-product-expense';
import { BillableProfileTicketServiceExpense } from './billable-profile-ticket-service-expense';

export class InvoiceProfileTicket {
    closedAt: number;
    discountSum: number;
    number: string;
    productExpense: Array<BillableProfileTicketProductExpense>;
    productsSum: number;
    serviceExpense: Array<BillableProfileTicketServiceExpense>;
    servicesSum: number;
    subject: string;
    taxSum: number;
    totalSum: number;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}