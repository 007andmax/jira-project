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
    isOverDue: boolean = false;
    ticketNumbers: Array<String>;
    selected:boolean = false;
    blockSelected:boolean = false;
    paymentAmount:number = 0;
    totalSum:number;
    constructor(data) {
        this.companyId = (data.company) ? data.company.id : '';
        this.date = data.date;
        this.deletedAt = data.deletedAt;
        this.dueDate = data.dueDate;
        this.id = data.id;
        this.number = data.number;
        this.paidOn = data.paidOn;
        this.paidSum = data.paidSum;
        this.partialPayments = (data.partialPayments) ? data.partialPayments.map(item => {
            return new InvoicePartialPayments(item);
        }) : [];
        this.payment = data.payment;
        this.readedAt = data.readedAt;
        this.recurringInvoice = data.recurringInvoice;
        this.status = data.status;
        this.sum = data.sum;
        this.ticketNumbers = data.ticketNumbers;


        var today = Date.now();
        var dueDate = new Date(this.dueDate).getTime();
        let overDue = (dueDate - today) / 86400000;
        this.isOverDue = (overDue < 0);
        this.totalSum = data.totalSum;
    }
}