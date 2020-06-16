import { BillableProfileTicketProductExpenseItem } from './billable-profile-ticket-product-expense-item';

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
    taxes: any;
    ticketId: string;
    ticketUpdateId: string;
    totalSum: number;
}