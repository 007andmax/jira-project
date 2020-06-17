import { BillableProfileTicketServiceExpenseItem } from './billable-profile-ticket-service-expense-item';
import { Tax } from 'src/ng2/class/taxes/tax';

export class BillableProfileTicketServiceExpense {
    agreementBillType: any;
    billableQuantity: number;
    createdAt: number;
    description: string;
    discountAmount: number;
    discountSum: number;
    discountType: string;
    id: string;
    item: BillableProfileTicketServiceExpenseItem;
    price: number;
    sum: number;
    taxSum: number;
    taxes: Array<Tax>;
    ticketId: string;
    ticketUpdateId: string;
    totalSum: number;
}