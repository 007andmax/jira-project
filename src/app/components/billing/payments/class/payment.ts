import { Company } from 'src/app/interfaces/company/company';
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
    paymentStatus: string;
    totalSum: number;
    multipleCompanies: Array<any> = [];
    transactionId: string;
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
            return new PaymentData(item.invoiceAmount, item.invoiceDate, item.invoiceId, item.paidAmount, item.invoiceNumber, item.invoicePaidDue, item.companyName);
        }) : [];
        this.paymentMethod = data.paymentMethod;
        this.reference = data.reference;
        this.paymentStatus = data.paymentStatus;
        this.totalSum = data.totalSum;
        this.multipleCompanies = data.multipleCompanies;
        this.transactionId = data.transactionId;
    }
    public getDataForExportPDF() {
        return {
            createdAt: this.createdAt,
            multipleCompanies: this.multipleCompanies.map(item => ({ name: item.name })),
            note: this.note,
            paymentMethod: this.paymentMethod,
            partialPaidAmount: this.partialPaidAmount,
            partialPaidInvoices: this.partialPaidInvoices,
            reference: this.reference,
            status: this.paymentStatus ? 'Refund' : 'Paid'
        }
    }

}