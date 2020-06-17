import { BillableProfileTicketProductExpense } from './billable-profile-ticket-product-expense';
import { BillableProfileTicketServiceExpense } from './billable-profile-ticket-service-expense';

export class BillableProfileTicket {
    closedAt: number;
    companyId: string;
    discountSum: number;
    id: string;
    isOrder: boolean;
    lockedBy: any;
    productExpense: Array<BillableProfileTicketProductExpense>;
    productSum: number;
    serviceExpense: Array<BillableProfileTicketServiceExpense>
    serviceSum: number;
    subject: string;
    sum: number;
    taxSum: number;
    ticketNumber: string;
    constructor() {
      
    }
}