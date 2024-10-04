export class PaymentData {
    invoiceAmount: number;
    invoiceDate: number;
    invoiceId: string;
    paidAmount: number;
    paidAmount_str: string;
    invoicePaidDue: number;
    invoiceNumber: string;
    companyName: string;
    constructor(invoiceAmount, invoiceDate, invoiceId, paidAmount, invoiceNumber, invoicePaidDue, companyName) {
        this.invoiceAmount = invoiceAmount;
        this.invoiceDate = invoiceDate;
        this.invoiceId = invoiceId;
        this.paidAmount = paidAmount;
        this.invoiceNumber = invoiceNumber;
        this.invoicePaidDue = invoicePaidDue;
        this.paidAmount_str = this.paidAmount.toFixed(2);
        this.companyName = companyName;
    }
}