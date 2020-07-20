import { InvoicePartialPayments } from './invoice-partial-payments';

export class Invoice {
    companyId: string;
    date: string;
    deletedAt: number;
    dueDate: string;
    id: string;
    number: string;
    paidOn: any;
    paidSum: number;
    partialPayments: Array<InvoicePartialPayments>;
    payment: any;
    readedAt: any;
    recurringInvoice: any;
    status: string;
    sum: number;
    ticketNumbers: Array<String>;
}