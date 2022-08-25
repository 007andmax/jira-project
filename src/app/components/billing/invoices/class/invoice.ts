import { Company } from 'src/app/interfaces/company/company';
import { InvoicePartialPayments } from './invoice-partial-payments';

export class Invoice {
    companyId: string;
    company: Company;
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
    selected: boolean = false;
    blockSelected: boolean = false;
    paymentAmount: number = 0;
    totalSum: number;
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
        this.company = data.company;

        var today = Date.now();
        var dueDate = new Date(this.dueDate).getTime();
        let overDue = (dueDate - today) / 86400000;
        this.isOverDue = (overDue < 0);
        this.totalSum = data.totalSum;
    }
    public getOverDueDate() {
        var dueDate = new Date(this.dueDate).getTime();
        var today = Date.now();
        let overDue = (dueDate - today) / 86400000;
        let outstanding = (new Date(this.date).getTime() - today) / 86400000;
        let isOverDue = (overDue < 0);
        let isOutstanding = (overDue > 0);
        if (isOverDue) {
            return Math.abs(Math.floor(overDue));
        } else if (isOutstanding) {
            return Math.abs(Math.floor(outstanding));
        }
        return '';
    };
    public getDueDate() {
        var dueDate = new Date(this.dueDate).getTime();
        var today = Date.now();
        let overDue = (dueDate - today) / 86400000;
        let outstanding = (new Date(this.date).getTime() - today) / 86400000;
        let isOverDue = (overDue < 0);
        let isOutstanding = (overDue > 0);
        if (isOverDue) {
            return Math.abs(Math.floor(overDue));
        } else if (isOutstanding) {
            return Math.abs(Math.floor(overDue));
        }
        return '';
    }
    public getPaidOnDate() {
        var today = Date.now();
        var paidOn = new Date(this.paidOn).getTime();
        var paid = (today - paidOn) / 86400000;
        return Math.floor(Math.abs(paid));
    };
    public getDataForExportPDF() {
        let invoiceStatus;
        if (this.isOverDue && !this.paidOn) invoiceStatus = `Overdue by ${this.getOverDueDate()} days`;
        if (!this.isOverDue && !this.paidOn) invoiceStatus = `Due in ${this.getDueDate()} days`;
        if (this.paidOn) invoiceStatus = `Paid ${this.getPaidOnDate()} days ago`;
        let balanceDue = ((this.totalSum || this.sum) - this.paidSum);
        return {
            date: this.date,
            number: this.number,
            readedAt: this.readedAt,
            invoiceStatus: invoiceStatus,
            company: {
                name: this.company.name
            },
            sum: this.sum,
            totalSum: this.totalSum,
            balanceDue: balanceDue
        }
    }
}