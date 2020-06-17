import { BillableProfileTicketProductExpenseItem } from './billable-profile-ticket-product-expense-item';
import { Tax } from 'src/ng2/class/taxes/tax';

export class BillableProfileTicketProductExpense {
    billableQuantity: number;
    createdAt: number;
    discountAmount: number;
    discountSum: number;
    discountType: string;
    id: string;
    item: BillableProfileTicketProductExpenseItem;
    price: number;
    serialNumber: string;
    sum: number;
    taxSum: number;
    taxes: Array<Tax>;
    ticketId: string;
    ticketUpdateId: string;
    totalSum: number;
}