import { PaymentData } from './payment-Data';

export class Payment {
    clientCompanyId: string;
    clientCompanyName: string;
    createdAt: string;
    depositId: string;
    id: string;
    invoiceNumbers: Array<string> = [];
    note: string;
    partialPaidAmount: number;
    partialPaidInvoices: Array<string> = [];
    paymentData: Array<PaymentData> = [];
    paymentMethod: string;
    reference: string;
    refundMethod: string;
    totalSum: number;
    constructor(data) {
        this.clientCompanyId = data.clientCompanyId;
        this.clientCompanyName = data.clientCompanyName;
        this.createdAt = data.createdAt;
        this.depositId = data.depositId;
        this.id = data.id;
        this.invoiceNumbers = data.invoiceNumbers;
        this.note = data.note;
        this.partialPaidAmount = data.partialPaidAmount;
        this.partialPaidInvoices = data.partialPaidInvoices;
        this.paymentData = (data.paymentData) ? data.paymentData.map(item => {
            return new PaymentData(item.invoiceAmount, item.invoiceDate, item.invoiceId, item.paidAmount, item.invoiceNumber, item.invoicePaidDue);
        }) : [];
        this.paymentMethod = data.paymentMethod;
        this.reference = data.reference;
        this.refundMethod = data.refundMethod;
        this.totalSum = data.totalSum;
    }

}